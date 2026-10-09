import React from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { getWeekDates, formatDateISO } from '../../data/mockData';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const WEEK_DAY_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const WeeklyCalendarStrip: React.FC = () => {
  const {
    currentWeekOffset,
    activeCollaboratorId,
    shifts,
    selectedDayDate,
    setSelectedDayDate,
  } = useSchedule();

  const weekDates = getWeekDates(currentWeekOffset);
  const todayStr = formatDateISO(new Date());

  return (
    <div className="bg-white border-b border-slate-200 px-2 py-3 shadow-xs">
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((dateObj, idx) => {
          const dateStr = formatDateISO(dateObj);
          const isSelected = selectedDayDate === dateStr;
          const isToday = dateStr === todayStr;

          // Find shift for this day
          const shift = shifts.find(
            (s) => s.collaboratorId === activeCollaboratorId && s.date === dateStr
          );

          const isDsr = shift?.type === 'folga_dsr' || shift?.type === 'folga';
          const isPlantao = shift?.type === 'plantao';
          const isWork = shift?.type === 'trabalho';
          const isAck = shift?.acknowledged;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDayDate(dateStr)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all relative ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600 scale-[1.02]'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              {/* Day name */}
              <span
                className={`text-[11px] font-bold uppercase tracking-wider ${
                  isSelected ? 'text-blue-100' : 'text-slate-500'
                }`}
              >
                {WEEK_DAY_NAMES[idx]}
              </span>

              {/* Day number */}
              <span
                className={`text-base font-extrabold leading-tight my-0.5 ${
                  isSelected
                    ? 'text-white'
                    : isToday
                      ? 'text-blue-600 underline font-black'
                      : 'text-slate-800'
                }`}
              >
                {dateObj.getDate()}
              </span>

              {/* Status Indicator Tag */}
              <div className="mt-0.5 flex items-center justify-center">
                {isDsr ? (
                  <span
                    className={`text-[9px] font-bold px-1 rounded-sm leading-tight ${
                      isSelected
                        ? 'bg-emerald-400 text-emerald-950 font-black'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    DSR
                  </span>
                ) : isPlantao ? (
                  <span
                    className={`text-[9px] font-bold px-1 rounded-sm leading-tight ${
                      isSelected
                        ? 'bg-purple-300 text-purple-950 font-black'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    PLANTÃO
                  </span>
                ) : isWork ? (
                  <span
                    className={`text-[9px] font-semibold leading-tight font-mono ${
                      isSelected ? 'text-blue-100' : 'text-slate-600'
                    }`}
                  >
                    {shift?.presentationTime || 'Turno'}
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-400">-</span>
                )}
              </div>

              {/* Acknowledgement mini dot */}
              <div className="absolute top-1 right-1">
                {isWork && !isAck && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ring-1 ring-white block" title="Ciência pendente" />
                )}
                {isWork && isAck && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" title="Ciência confirmada" />
                )}
              </div>

              {/* Today subtle marker */}
              {isToday && !isSelected && (
                <div className="w-1 h-1 rounded-full bg-blue-600 mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
