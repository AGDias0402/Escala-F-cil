import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { Smartphone, Monitor, Signal, Wifi, Battery } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { deviceFrameMode, setDeviceFrameMode, userRole } = useSchedule();
  const currentTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center">
      {/* Top Bar for Simulator Mode Switcher */}
      <header className="w-full bg-slate-950/80 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex items-center justify-between text-xs z-40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-200 tracking-wide uppercase text-[11px]">
            Max Tour · Tráfego & Escalas
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">
            Ambiente Operacional v2.4
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => setDeviceFrameMode('mobile-frame')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                deviceFrameMode === 'mobile-frame'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualizar em formato de smartphone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo Celular</span>
            </button>
            <button
              onClick={() => setDeviceFrameMode('responsive')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                deviceFrameMode === 'responsive'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualizar tela cheia responsiva"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tela Expandida</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="w-full flex-1 flex items-start justify-center p-0 sm:py-6 sm:px-4">
        {deviceFrameMode === 'mobile-frame' ? (
          /* Phone Mockup Frame */
          <div className="w-full sm:max-w-[430px] sm:min-h-[850px] sm:max-h-[92vh] bg-slate-50 text-slate-900 sm:rounded-[42px] sm:shadow-2xl sm:shadow-black/70 sm:border-[10px] sm:border-slate-800 flex flex-col relative overflow-hidden">
            {/* Phone Speaker & Camera Notch */}
            <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 h-5 w-36 bg-slate-800 rounded-b-2xl z-50 items-center justify-center">
              <div className="w-12 h-1 bg-slate-700 rounded-full mb-1" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 ml-3" />
            </div>

            {/* Mobile Status Bar */}
            <div className="w-full bg-slate-900 text-white px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold tracking-tight z-40 select-none">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5 opacity-90">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* App Body Inside Mobile Frame */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative bg-slate-100">
              {children}
            </div>

            {/* Mobile Home Bar Indicator */}
            <div className="hidden sm:flex w-full bg-slate-100 py-1.5 justify-center items-center select-none border-t border-slate-200/50">
              <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
            </div>
          </div>
        ) : (
          /* Expanded Full-Width Responsive View */
          <div className="w-full max-w-7xl min-h-[850px] bg-slate-50 text-slate-900 sm:rounded-2xl shadow-xl sm:border border-slate-800 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col bg-slate-100">
              {children}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
