import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Collaborator, Shift } from '../../types/schedule';
import { getWeekDates, formatDateISO } from '../../data/mockData';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Clock, 
  Bus, 
  User, 
  ChevronRight,
  ShieldAlert,
  Send
} from 'lucide-react';
import { EditShiftModal } from './EditShiftModal';

const DAY_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

export const WeeklyMatrixGrid: React.FC = () => {
  const {
    collaborators,
    shifts,
    currentWeekOffset,
  } = useSchedule();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);
  const [editingData, setEditingData] = useState<{
    shift?: Shift;
    collaboratorId: string;
    date: string;
  } | null>(null);

  const weekDates = getWeekDates(currentWeekOffset);

  // Filter collaborators
  const filteredCollaborators = collaborators.filter((colab) => {
    const matchesSearch =
      colab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colab.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colab.role.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterPendingOnly) {
      // Check if collaborator has unacknowledged shifts this week
      const weekDatesStr = weekDates.map(formatDateISO);
      const colabShifts = shifts.filter(
        (s) => s.collaboratorId === colab.id && weekDatesStr.includes(s.date)
      );
      const hasPending = colabShifts.some(
        (s) => (s.type === 'trabalho' || s.type === 'plantao') && !s.acknowledged
      );
      return hasPending;
    }

    return true;
  });

  return (
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar colaborador, matrícula ou função..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
          />
        </div>

        <button
          onClick={() => setFilterPendingOnly(!filterPendingOnly)}
          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
            filterPendingOnly
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Filtrar colaboradores que não deram ciência"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Só Pendentes</span>
        </button>
      </div>

      {/* List of Collaborator Weekly Shift Cards */}
      <div className="space-y-3">
        {filteredCollaborators.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-slate-800">Nenhum colaborador encontrado</h4>
            <p className="text-xs text-slate-500 mt-1">
              Tente alterar os termos de busca ou remover o filtro de pendências.
            </p>
          </div>
        ) : (
          filteredCollaborators.map((colab) => {
            const colabWeekShifts = weekDates.map((d) => {
              const iso = formatDateISO(d);
              return {
                date: iso,
                dateObj: d,
                shift: shifts.find((s) => s.collaboratorId === colab.id && s.date === iso),
              };
            });

            const workCount = colabWeekShifts.filter(
              (item) => item.shift?.type === 'trabalho' || item.shift?.type === 'plantao'
            ).length;

            const ackCount = colabWeekShifts.filter(
              (item) =>
                (item.shift?.type === 'trabalho' || item.shift?.type === 'plantao') &&
                item.shift?.acknowledged
            ).length;

            const hasPending = workCount > ackCount;

            return (
              <div
                key={colab.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden"
              >
                {/* Collab Header */}
                <div className="p-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={colab.avatar}
                      alt={colab.name}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {colab.name}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                          {colab.matricula}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {colab.role} · CNH {colab.cnhCategory || 'D'}
                      </p>
                    </div>
                  </div>

                  {/* Science status badge */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    {hasPending ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>{ackCount}/{workCount} ciente</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>100% Ciente</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 7-Day Mini Calendar Cells */}
                <div className="p-2.5">
                  <div className="grid grid-cols-7 gap-1">
                    {colabWeekShifts.map(({ date, dateObj, shift }, dayIdx) => {
                      const isDsr = shift?.type === 'folga_dsr' || shift?.type === 'folga';
                      const isPlantao = shift?.type === 'plantao';
                      const isWork = shift?.type === 'trabalho';
                      const isAck = shift?.acknowledged;

                      return (
                        <button
                          key={date}
                          onClick={() =>
                            setEditingData({
                              shift,
                              collaboratorId: colab.id,
                              date,
                            })
                          }
                          className={`flex flex-col items-center py-1.5 px-0.5 rounded-xl border text-center transition-all hover:scale-102 hover:shadow-xs ${
                            isDsr
                              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                              : isPlantao
                                ? 'bg-purple-50/80 border-purple-200 text-purple-900'
                                : isWork
                                  ? isAck
                                    ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                                    : 'bg-amber-50/80 border-amber-300 text-amber-950 ring-1 ring-amber-400/40'
                                  : 'bg-slate-50 border-slate-200 text-slate-500'
                          }`}
                          title="Clique para editar escala deste dia"
                        >
                          <span className="text-[9px] font-bold uppercase text-slate-500">
                            {DAY_NAMES[dayIdx]}
                          </span>
                          <span className="text-xs font-black my-0.5 leading-none">
                            {dateObj.getDate()}
                          </span>

                          <span className="text-[9px] font-bold truncate max-w-full leading-tight font-mono">
                            {isDsr ? 'DSR' : isPlantao ? 'PLANTÃO' : isWork ? (shift?.presentationTime || 'Turno') : '-'}
                          </span>

                          {/* Ack Dot */}
                          {isWork && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-1 ${
                                isAck ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                    <span className="truncate">
                      Toque em um dia para ajustar horários, linha ou folga.
                    </span>
                    <button
                      onClick={() => {
                        const message = `Olá ${colab.name}! Por favor confirme ciência da sua escala semanal no aplicativo da Max Tour.`;
                        const encoded = encodeURIComponent(message);
                        window.open(`https://api.whatsapp.com/send?phone=55${colab.phone.replace(/\D/g, '')}&text=${encoded}`, '_blank');
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 shrink-0 ml-2"
                      title="Enviar lembrete via WhatsApp"
                    >
                      <Send className="w-3 h-3" />
                      <span>Lembrar no Zap</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Shift Modal */}
      {editingData && (
        <EditShiftModal
          initialShift={editingData.shift}
          initialCollaboratorId={editingData.collaboratorId}
          initialDate={editingData.date}
          onClose={() => setEditingData(null)}
        />
      )}
    </div>
  );
};
