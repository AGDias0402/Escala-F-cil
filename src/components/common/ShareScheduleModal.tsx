import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Share2, Check, Copy, MessageSquare, Printer, X, Download } from 'lucide-react';
import { getWeekDates, formatDateISO } from '../../data/mockData';

interface ShareScheduleModalProps {
  onClose: () => void;
}

export const ShareScheduleModal: React.FC<ShareScheduleModalProps> = ({ onClose }) => {
  const {
    activeCollaborator,
    activeCollaboratorId,
    currentWeekOffset,
    getShiftsForCollaboratorWeek,
  } = useSchedule();

  const [copied, setCopied] = useState(false);

  const weekDates = getWeekDates(currentWeekOffset);
  const shifts = getShiftsForCollaboratorWeek(activeCollaboratorId, currentWeekOffset);

  const dayNames = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  // Build clean WhatsApp message
  const generateMessage = () => {
    const header = `🚌 *ESCALA SEMANAL - MAX TOUR*\n👤 *Colaborador:* ${activeCollaborator.name} (${activeCollaborator.matricula})\n🏷 *Função:* ${activeCollaborator.role}\n📅 *Período:* ${weekDates[0].toLocaleDateString('pt-BR')} a ${weekDates[6].toLocaleDateString('pt-BR')}\n----------------------------------\n`;

    const body = weekDates
      .map((d, idx) => {
        const iso = formatDateISO(d);
        const shift = shifts.find((s) => s.date === iso);
        const dayLabel = `${dayNames[idx]} (${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })})`;

        if (!shift) return `▪️ ${dayLabel}: Sem escala definida`;
        if (shift.type === 'folga_dsr' || shift.type === 'folga') {
          return `🟢 *${dayLabel}: FOLGA (DSR)*`;
        }
        if (shift.type === 'plantao') {
          return `🟣 *${dayLabel}: PLANTÃO CCO* (${shift.startTime || '07:00'} às ${shift.endTime || '16:00'})`;
        }
        return `🚍 *${dayLabel}*: ${shift.lineCode || 'Linha'} | ⏰ Pegada: *${shift.presentationTime || '05:30'}* | 🏁 Jornada: ${shift.startTime} às ${shift.endTime} | 🚎 ${shift.vehiclePrefix || 'Ônibus'}`;
      })
      .join('\n\n');

    const footer = `\n----------------------------------\n✅ Escala gerada via Sistema EscalaMax Operacional`;
    return header + body + footer;
  };

  const messageText = generateMessage();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Compartilhar Escala</h3>
              <p className="text-[11px] text-slate-400">Exportação para WhatsApp ou Cópia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <p className="text-xs text-slate-600">
            Texto pronto formatado para envio no WhatsApp pessoal ou da família:
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-56 overflow-y-auto font-mono text-[11px] text-slate-700 whitespace-pre-wrap select-all">
            {messageText}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-600" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            <button
              onClick={handleWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Abrir no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
