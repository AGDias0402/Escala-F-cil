import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Bell, Check, X, Send } from 'lucide-react';

interface BroadcastNoticeModalProps {
  onClose: () => void;
}

export const BroadcastNoticeModal: React.FC<BroadcastNoticeModalProps> = ({ onClose }) => {
  const { addNotice } = useSchedule();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'alta' | 'urgente'>('alta');
  const [targetAudience, setTargetAudience] = useState<'todos' | 'motoristas' | 'monitores'>('todos');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addNotice({
      title: title.trim(),
      message: message.trim(),
      date: 'Agora',
      author: 'Carlos Mendonça (Coord. Tráfego)',
      priority,
      targetAudience,
    });

    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Publicar Comunicado Geral</h3>
              <p className="text-[11px] text-slate-400">Notificação para toda a equipe de campo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {sent ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-900">Comunicado Publicado!</h4>
              <p className="text-xs text-slate-500 mt-1">
                O aviso já está visível para os colaboradores no aplicativo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Comunicado:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Escala de Feriado Confirmada / Treinamento"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prioridade:</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="normal">Normal</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Público:</label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todos">Todos os Colaboradores</option>
                    <option value="motoristas">Apenas Motoristas</option>
                    <option value="monitores">Apenas Monitores</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mensagem:</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  required
                  placeholder="Instruções operacionais detalhadas..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Aviso</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
