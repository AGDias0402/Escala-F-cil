import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { 
  Bus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  UserCheck, 
  Briefcase, 
  Users, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { getWeekDates } from '../data/mockData';

export const Header: React.FC = () => {
  const {
    userRole,
    setUserRole,
    activeCollaborator,
    activeCollaboratorId,
    setActiveCollaboratorId,
    collaborators,
    currentWeekOffset,
    setCurrentWeekOffset,
    resetAllData,
  } = useSchedule();

  const [showColabSelect, setShowColabSelect] = useState(false);

  const weekDates = getWeekDates(currentWeekOffset);
  const firstDay = weekDates[0];
  const lastDay = weekDates[6];

  const formatShortDate = (d: Date) => {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const weekLabel = 
    currentWeekOffset === 0 
      ? 'Esta Semana' 
      : currentWeekOffset === -1 
        ? 'Semana Passada' 
        : currentWeekOffset === 1 
          ? 'Próxima Semana' 
          : `${currentWeekOffset > 0 ? '+' : ''}${currentWeekOffset} sem.`;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-3 pb-3 px-3.5 sm:px-5 border-b border-slate-700/80 shadow-md">
      {/* Top Row: Brand & Role Switcher */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40 border border-blue-400/30">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-sm text-white">EscalaMax</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Max Tour
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium leading-none">
              Controle de Escala Operacional
            </p>
          </div>
        </div>

        {/* Role Toggle Pill */}
        <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setUserRole('colaborador')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              userRole === 'colaborador'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Colaborador</span>
          </button>
          <button
            onClick={() => setUserRole('gestor')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              userRole === 'gestor'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Gestor</span>
          </button>
        </div>
      </div>

      {/* Collaborator Switcher Row (When in collaborator view) */}
      {userRole === 'colaborador' ? (
        <div className="relative mb-2.5">
          <div className="flex items-center justify-between bg-slate-800/90 rounded-xl px-3 py-1.5 border border-slate-700/80">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={activeCollaborator.avatar}
                alt={activeCollaborator.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/40"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-slate-100 truncate">
                    {activeCollaborator.name}
                  </p>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                    {activeCollaborator.matricula}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {activeCollaborator.role} · {activeCollaborator.department}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowColabSelect(!showColabSelect)}
              className="ml-2 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg text-[11px] text-blue-300 font-semibold flex items-center gap-1 transition-colors shrink-0"
              title="Trocar colaborador para testar outra escala"
            >
              <Users className="w-3 h-3" />
              <span>Trocar</span>
            </button>
          </div>

          {/* Quick Dropdown to switch collaborator */}
          {showColabSelect && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="text-[10px] font-semibold uppercase text-slate-400 px-2 py-1 flex items-center justify-between">
                <span>Simular outro colaborador:</span>
                <button 
                  onClick={() => setShowColabSelect(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1">
                {collaborators.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCollaboratorId(c.id);
                      setShowColabSelect(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left transition-colors ${
                      c.id === activeCollaboratorId
                        ? 'bg-blue-600/30 text-white border border-blue-500/50'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <img src={c.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold truncate">{c.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{c.matricula}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block truncate">{c.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Gestor Active Header Banner */
        <div className="flex items-center justify-between bg-amber-950/40 rounded-xl px-3 py-1.5 border border-amber-800/50 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-xs font-bold text-amber-200">
              Painel de Tráfego e Gestão de Escalas
            </span>
          </div>
          <span className="text-[11px] text-amber-300 font-mono font-medium">
            Coordenação CCO
          </span>
        </div>
      )}

      {/* Week Navigator Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 rounded-xl px-2.5 py-1.5 border border-slate-700/60 text-xs">
        <button
          onClick={() => setCurrentWeekOffset(currentWeekOffset - 1)}
          className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Semana Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-center">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <div>
            <span className="font-bold text-slate-100 text-[12px] block leading-none">
              {formatShortDate(firstDay)} a {formatShortDate(lastDay)}
            </span>
            <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
              {weekLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {currentWeekOffset !== 0 && (
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className="px-2 py-0.5 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white text-[10px] font-semibold transition-colors"
            >
              Hoje
            </button>
          )}
          <button
            onClick={() => setCurrentWeekOffset(currentWeekOffset + 1)}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Próxima Semana"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
