import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { ArrowLeftRight, Check, X, Users, Calendar, AlertCircle } from 'lucide-react';
import { getWeekDates, formatDateISO } from '../../data/mockData';

interface SwapRequestModalProps {
  initialDate?: string;
  onClose: () => void;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  initialDate,
  onClose,
}) => {
  const {
    activeCollaboratorId,
    collaborators,
    currentWeekOffset,
    createSwapRequest,
  } = useSchedule();

  const weekDates = getWeekDates(currentWeekOffset);
  const otherCollaborators = collaborators.filter((c) => c.id !== activeCollaboratorId);

  const [targetColabId, setTargetColabId] = useState(otherCollaborators[0]?.id || '');
  const [requesterDate, setRequesterDate] = useState(
    initialDate || formatDateISO(weekDates[0])
  );
  const [targetDate, setTargetDate] = useState(
    initialDate || formatDateISO(weekDates[0])
  );
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    createSwapRequest({
      requesterDate,
      targetCollaboratorId: targetColabId,
      targetDate,
      reason: reason.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <ArrowLeftRight className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Solicitar Troca de Escala</h3>
              <p className="text-[11px] text-slate-400">Permuta sujeita a aprovação do Tráfego</p>
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
          {submitted ? (
            <div className="py-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Solicitação Enviada!</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Sua permuta foi encaminhada para a supervisão de tráfego. Você será notificado assim que for avaliada.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Day of the requester */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Seu dia a ser trocado:
                </label>
                <div className="relative">
                  <select
                    value={requesterDate}
                    onChange={(e) => setRequesterDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {weekDates.map((d) => {
                      const iso = formatDateISO(d);
                      const formatted = d.toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: '2-digit',
                      });
                      return (
                        <option key={iso} value={iso}>
                          {formatted}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Colleague to swap with */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Colega com quem deseja permutar:
                </label>
                <select
                  value={targetColabId}
                  onChange={(e) => setTargetColabId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {otherCollaborators.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.matricula} - {c.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Day of the colleague */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Dia em que você assumirá o turno dele(a):
                </label>
                <select
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {weekDates.map((d) => {
                    const iso = formatDateISO(d);
                    const formatted = d.toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      day: '2-digit',
                      month: '2-digit',
                    });
                    return (
                      <option key={iso} value={iso}>
                        {formatted}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. Justificativa para a permuta:
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  required
                  placeholder="Ex: Consulta médica agendada, compromisso familiar urgente..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              {/* Regulatory Notice */}
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  A troca só é válida após homologação pelo supervisor de tráfego respeitando o intervalo interjornada de 11h.
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!reason.trim()}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Enviar Solicitação</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
