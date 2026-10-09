import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Shift } from '../../types/schedule';
import { ShieldCheck, CheckCircle2, Clock, X, FileText, Check } from 'lucide-react';

interface AcknowledgeModalProps {
  shift?: Shift;
  mode: 'single' | 'week';
  onClose: () => void;
}

export const AcknowledgeModal: React.FC<AcknowledgeModalProps> = ({
  shift,
  mode,
  onClose,
}) => {
  const {
    activeCollaborator,
    activeCollaboratorId,
    currentWeekOffset,
    acknowledgeShift,
    acknowledgeAllWeek,
  } = useSchedule();

  const [confirmed, setConfirmed] = useState(false);
  const currentTime = new Date().toLocaleString('pt-BR');

  const handleConfirm = () => {
    if (mode === 'single' && shift) {
      acknowledgeShift(shift.id);
    } else {
      acknowledgeAllWeek(activeCollaboratorId, currentWeekOffset);
    }
    setConfirmed(true);
    setTimeout(() => {
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Termo de Ciência de Escala</h3>
              <p className="text-[11px] text-slate-400">Fretamento Max Tour · CCO Operacional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {confirmed ? (
            <div className="py-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Ciência Confirmada!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                O registro foi gravado no sistema do Tráfego com data e hora oficial. Bom trabalho!
              </p>
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">
                Carimbo: {currentTime}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-100 flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <p className="font-semibold mb-1">
                    Declaração Eletrônica de Notificação de Escala
                  </p>
                  <p className="text-blue-800/90 text-[11px]">
                    Eu, <strong className="font-bold">{activeCollaborator.name}</strong> (Matrícula: {activeCollaborator.matricula}), declaro que tomei ciência formal dos meus horários, rotas e folgas programadas para a {mode === 'week' ? 'semana de trabalho' : `jornada do dia ${shift?.date}`}.
                  </p>
                </div>
              </div>

              {mode === 'single' && shift && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Data:</span>
                    <span className="font-semibold text-slate-800">{shift.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Horário Apresentação:</span>
                    <span className="font-mono font-bold text-blue-700">{shift.presentationTime || '05:30'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Linha / Rota:</span>
                    <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">
                      {shift.lineCode || 'Escala Padrão'}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-400 text-center">
                Em conformidade com a Consolidação das Leis do Trabalho (CLT) e regulamento de tráfego.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Agora</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
