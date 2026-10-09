import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeftRight, 
  Plus, 
  Bell, 
  Send, 
  Calendar, 
  ShieldCheck, 
  Briefcase,
  FileSpreadsheet
} from 'lucide-react';
import { WeeklyMatrixGrid } from './WeeklyMatrixGrid';
import { SwapApprovalsList } from './SwapApprovalsList';
import { EditShiftModal } from './EditShiftModal';
import { BroadcastNoticeModal } from './BroadcastNoticeModal';

export const ManagerDashboard: React.FC = () => {
  const {
    currentWeekOffset,
    getWeekStats,
    swapRequests,
    collaborators,
    notices,
  } = useSchedule();

  const [activeTab, setActiveTab] = useState<'grid' | 'swaps' | 'notices'>('grid');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [copiedReminder, setCopiedReminder] = useState(false);

  const stats = getWeekStats(currentWeekOffset);
  const pendingSwapsCount = swapRequests.filter((s) => s.status === 'pendente').length;

  // Broadcast reminder to pending employees
  const handleRemindAllPending = () => {
    const text = `Atenção equipe Max Tour! A escala semanal de tráfego já está liberada. Todos os colaboradores que ainda não confirmaram ciência devem acessar o aplicativo agora para validar seus horários.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setCopiedReminder(true);
    setTimeout(() => setCopiedReminder(false), 2500);
  };

  return (
    <div className="flex-1 p-3.5 space-y-3.5 pb-10">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Metric 1: Acknowledgement rate */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Taxa de Ciência</span>
            <ShieldCheck className={`w-4 h-4 ${stats.acknowledgementRate >= 80 ? 'text-emerald-500' : 'text-amber-500'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {stats.acknowledgementRate}%
            </span>
            <span className="text-[10px] text-slate-500">
              ({stats.acknowledgedCount}/{stats.totalActiveShifts})
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                stats.acknowledgementRate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${stats.acknowledgementRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Pending Confirmations */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pendentes</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-amber-600 font-mono">
              {stats.pendingCount}
            </span>
            <span className="text-[10px] text-slate-500">turnos</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">
            Aguardando ciência do motorista
          </p>
        </div>

        {/* Metric 3: Active Employees & DSR */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Equipe Total</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {stats.totalEmployees}
            </span>
            <span className="text-[10px] text-slate-500">colaboradores</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">
            {stats.dsrCount} folgas DSR programadas
          </p>
        </div>

        {/* Metric 4: Shift Swaps */}
        <div 
          onClick={() => setActiveTab('swaps')}
          className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Permutas</span>
            <ArrowLeftRight className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-indigo-600 font-mono">
              {pendingSwapsCount}
            </span>
            <span className="text-[10px] text-slate-500">pedidos</span>
          </div>
          <p className="text-[10px] text-indigo-600 font-semibold mt-1 truncate">
            {pendingSwapsCount > 0 ? 'Requer avaliação' : 'Todas avaliadas'}
          </p>
        </div>
      </div>

      {/* Operational Alert Box if there are pending */}
      {stats.pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Aviso: {stats.pendingCount} escalas aguardam confirmação de ciência
              </h4>
              <p className="text-[11px] text-amber-800">
                Lembre a equipe para evitar imprevistos de apresentação nas garagens.
              </p>
            </div>
          </div>

          <button
            onClick={handleRemindAllPending}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lembrar Equipe</span>
          </button>
        </div>
      )}

      {/* Quick Action Buttons for Manager */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setShowEditModal(true)}
          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 active:scale-98 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar / Alterar Escala</span>
        </button>

        <button
          onClick={() => setShowNoticeModal(true)}
          className="py-2.5 px-3 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
        >
          <Bell className="w-4 h-4 text-amber-600" />
          <span>Publicar Comunicado CCO</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-200/80 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'grid'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Grade da Semana</span>
        </button>

        <button
          onClick={() => setActiveTab('swaps')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative ${
            activeTab === 'swaps'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Permutas ({pendingSwapsCount})</span>
          {pendingSwapsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping absolute top-1 right-2" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'notices'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Mural ({notices.length})</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'grid' && <WeeklyMatrixGrid />}
      {activeTab === 'swaps' && <SwapApprovalsList />}
      {activeTab === 'notices' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800">
              Comunicados e Avisos Ativos
            </h4>
            <button
              onClick={() => setShowNoticeModal(true)}
              className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Novo Aviso</span>
            </button>
          </div>

          <div className="space-y-2">
            {notices.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{n.title}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      n.priority === 'urgente'
                        ? 'bg-red-100 text-red-800'
                        : n.priority === 'alta'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {n.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Publicado por: {n.author}</span>
                  <span>{n.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showEditModal && (
        <EditShiftModal onClose={() => setShowEditModal(false)} />
      )}

      {showNoticeModal && (
        <BroadcastNoticeModal onClose={() => setShowNoticeModal(false)} />
      )}
    </div>
  );
};
