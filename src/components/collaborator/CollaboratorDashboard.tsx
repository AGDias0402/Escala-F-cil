import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { WeeklyCalendarStrip } from './WeeklyCalendarStrip';
import { WeeklySummaryBar } from './WeeklySummaryBar';
import { DayShiftCard } from './DayShiftCard';
import { Bell, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';

export const CollaboratorDashboard: React.FC = () => {
  const {
    activeCollaboratorId,
    notices,
    swapRequests,
    collaborators,
  } = useSchedule();

  // Swaps involving this collaborator
  const mySwaps = swapRequests.filter(
    (s) => s.requesterId === activeCollaboratorId || s.targetCollaboratorId === activeCollaboratorId
  );

  return (
    <div className="flex-1 flex flex-col pb-8">
      {/* Weekly Calendar Horizontal Strip */}
      <WeeklyCalendarStrip />

      {/* Weekly Summary Bar with fast stats and bulk acknowledge */}
      <WeeklySummaryBar />

      {/* Active Operational Notices (from Manager) */}
      {notices.length > 0 && (
        <div className="px-3.5 pt-3">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider">
                Mural Operacional · {notices[0].author}
              </span>
            </div>
            <h4 className="text-xs font-bold text-white mb-0.5">
              {notices[0].title}
            </h4>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              {notices[0].message}
            </p>
          </div>
        </div>
      )}

      {/* Pending / Recent Swap Alert */}
      {mySwaps.length > 0 && mySwaps[0].status === 'pendente' && (
        <div className="px-3.5 pt-2">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 flex items-start gap-2.5">
            <ArrowLeftRight className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-950">
              <span className="font-bold block">
                Solicitação de Permuta em Análise
              </span>
              <p className="text-[11px] text-indigo-800 mt-0.5">
                Troca com {collaborators.find((c) => c.id === mySwaps[0].targetCollaboratorId)?.name} para {mySwaps[0].targetDate} aguardando aprovação do Gestor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Day Shift Detail Card */}
      <DayShiftCard />
    </div>
  );
};
