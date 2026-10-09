import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { CheckCircle2, Clock, CalendarDays, ShieldCheck, CheckCheck } from 'lucide-react';
import { AcknowledgeModal } from './AcknowledgeModal';

export const WeeklySummaryBar: React.FC = () => {
  const {
    activeCollaborator,
    activeCollaboratorId,
    currentWeekOffset,
    getShiftsForCollaboratorWeek,
  } = useSchedule();

  const [showModal, setShowModal] = useState(false);

  const weekShifts = getShiftsForCollaboratorWeek(activeCollaboratorId, currentWeekOffset);
  const workShifts = weekShifts.filter((s) => s.type === 'trabalho' || s.type === 'plantao');
  const dsrShifts = weekShifts.filter((s) => s.type === 'folga_dsr' || s.type === 'folga');
  const acknowledgedShifts = workShifts.filter((s) => s.acknowledged);
  const allAcknowledged = workShifts.length > 0 && acknowledgedShifts.length === workShifts.length;

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Left summary counters */}
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-800">{workShifts.length}</span>
            <span className="text-[11px] text-slate-500">dias trab.</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-800">{dsrShifts.length}</span>
            <span className="text-[11px] text-slate-500">folga DSR</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-800 font-mono">~44h</span>
          </div>
        </div>

        {/* Right status / action */}
        {allAcknowledged ? (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300/60">
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Semana 100% Ciente</span>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm shadow-amber-500/20 transition-all active:scale-95 animate-pulse"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Confirmar Ciência ({acknowledgedShifts.length}/{workShifts.length})</span>
          </button>
        )}
      </div>

      {showModal && (
        <AcknowledgeModal
          mode="week"
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
