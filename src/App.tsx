import React from 'react';
import { ScheduleProvider, useSchedule } from './context/ScheduleContext';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { CollaboratorDashboard } from './components/collaborator/CollaboratorDashboard';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { Calendar, Users, ArrowLeftRight, Bell, Shield, Phone, Sparkles } from 'lucide-react';

function AppContent() {
  const { userRole, setUserRole, swapRequests, notices } = useSchedule();
  const pendingSwaps = swapRequests.filter((s) => s.status === 'pendente').length;

  return (
    <div className="flex-1 flex flex-col min-h-full">
      {/* App Header */}
      <Header />

      {/* Main Screen Content */}
      <div className="flex-1 overflow-y-auto">
        {userRole === 'colaborador' ? (
          <CollaboratorDashboard />
        ) : (
          <ManagerDashboard />
        )}
      </div>

      {/* Mobile Bottom Quick Switcher Bar */}
      <nav className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 px-3 py-2 flex items-center justify-around z-30 shadow-lg select-none">
        <button
          onClick={() => setUserRole('colaborador')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            userRole === 'colaborador'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Minha Escala</span>
        </button>

        <button
          onClick={() => setUserRole('gestor')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
            userRole === 'gestor'
              ? 'text-amber-600 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">Visão do Gestor</span>
          {pendingSwaps > 0 && userRole !== 'gestor' && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1 right-3" />
          )}
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <ScheduleProvider>
      <MobileFrame>
        <AppContent />
      </MobileFrame>
    </ScheduleProvider>
  );
}
