import React from 'react';
import { Phone, MessageSquare, ShieldAlert, X, Wrench, Clock, MapPin } from 'lucide-react';

interface EmergencyContactSheetProps {
  onClose: () => void;
}

export const EmergencyContactSheet: React.FC<EmergencyContactSheetProps> = ({ onClose }) => {
  const contacts = [
    {
      role: 'CCO / Plantão 24h (Central de Tráfego)',
      phone: '(11) 98877-1000',
      description: 'Avisos de atraso, quebra, acidentes e substituição urgente.',
      type: 'urgent',
    },
    {
      role: 'Supervisão de Escalas (Max Tour)',
      phone: '(11) 99988-7766',
      description: 'Dúvidas de jornada, atestados e permutas de turno.',
      type: 'support',
    },
    {
      role: 'Manutenção / Socorro Mecânico',
      phone: '(11) 97711-2233',
      description: 'Guincho, pane mecânica ou socorro elétrico na rota.',
      type: 'maintenance',
    },
    {
      role: 'Portaria & Garagem Central',
      phone: '(11) 3456-7890',
      description: 'Liberação de veículos, pátio e chaveiros.',
      type: 'gate',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in slide-in-from-bottom-4 duration-200">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-400">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Contatos Operacionais de Tráfego</h3>
              <p className="text-[11px] text-slate-400">Suporte imediato 24h para colaboradores</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
          {contacts.map((c, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border transition-all ${
                c.type === 'urgent'
                  ? 'bg-red-50/70 border-red-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-bold text-xs text-slate-900">{c.role}</span>
                <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {c.phone}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
                {c.description}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${c.phone.replace(/\D/g, '')}`}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Ligar Agora</span>
                </a>
                <a
                  href={`https://wa.me/55${c.phone.replace(/\D/g, '')}?text=Olá,%20sou%20colaborador%20da%20Max%20Tour%20e%20preciso%20de%20suporte%20operacional.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          ))}

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400">
              Garagem Central: Av. dos Autonomistas, 4200 · Setor Operacional Max Tour
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
