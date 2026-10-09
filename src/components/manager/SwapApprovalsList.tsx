import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { ArrowLeftRight, Check, X, Clock, User, Calendar, AlertCircle } from 'lucide-react';

export const SwapApprovalsList: React.FC = () => {
  const {
    swapRequests,
    collaborators,
    approveSwapRequest,
    rejectSwapRequest,
  } = useSchedule();

  const [tab, setTab] = useState<'pendentes' | 'historico'>('pendentes');

  const filteredSwaps = swapRequests.filter((s) =>
    tab === 'pendentes' ? s.status === 'pendente' : s.status !== 'pendente'
  );

  return (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl">
        <button
          onClick={() => setTab('pendentes')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            tab === 'pendentes'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pendentes de Avaliação ({swapRequests.filter((s) => s.status === 'pendente').length})
        </button>
        <button
          onClick={() => setTab('historico')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            tab === 'historico'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Histórico de Permutas
        </button>
      </div>

      {filteredSwaps.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <ArrowLeftRight className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-slate-800">
            {tab === 'pendentes' ? 'Nenhuma permuta pendente' : 'Nenhuma permuta no histórico'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {tab === 'pendentes'
              ? 'Todas as solicitações de troca foram avaliadas pelo tráfego.'
              : 'Nenhuma permuta avaliada anteriormente.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSwaps.map((swap) => {
            const requester = collaborators.find((c) => c.id === swap.requesterId);
            const target = collaborators.find((c) => c.id === swap.targetCollaboratorId);

            return (
              <div
                key={swap.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
              >
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Permuta de Turno
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      swap.status === 'pendente'
                        ? 'bg-amber-100 text-amber-800'
                        : swap.status === 'aprovado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {swap.status}
                  </span>
                </div>

                {/* Exchange Pair Box */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Solicitante
                    </span>
                    <p className="font-bold text-slate-800 truncate">{requester?.name || 'Colaborador'}</p>
                    <span className="text-[10px] font-mono text-slate-500 block">{requester?.matricula}</span>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-blue-700">
                      <Calendar className="w-3 h-3" />
                      <span>{swap.requesterDate}</span>
                    </div>
                  </div>

                  <div className="border-l border-slate-200 pl-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Substituto (Permuta)
                    </span>
                    <p className="font-bold text-slate-800 truncate">{target?.name || 'Colaborador'}</p>
                    <span className="text-[10px] font-mono text-slate-500 block">{target?.matricula}</span>
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-indigo-700">
                      <Calendar className="w-3 h-3" />
                      <span>{swap.targetDate}</span>
                    </div>
                  </div>
                </div>

                {/* Justification */}
                <div className="text-xs">
                  <span className="font-semibold text-slate-700">Motivo declarado:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    "{swap.reason}"
                  </p>
                </div>

                {/* Reviewer signature if reviewed */}
                {swap.reviewedBy && (
                  <div className="text-[10px] text-slate-400">
                    Avaliado por: <strong className="text-slate-600">{swap.reviewedBy}</strong> em{' '}
                    {new Date(swap.reviewedAt || '').toLocaleString('pt-BR')}
                  </div>
                )}

                {/* Action buttons if pending */}
                {swap.status === 'pendente' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => rejectSwapRequest(swap.id)}
                      className="py-2 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Recusar</span>
                    </button>
                    <button
                      onClick={() => approveSwapRequest(swap.id)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Aprovar & Trocar</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
