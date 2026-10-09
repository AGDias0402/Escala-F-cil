import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { 
  Clock, 
  MapPin, 
  Bus, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeftRight, 
  Share2, 
  Phone, 
  Calendar,
  Sparkles,
  Info,
  Building2,
  FileText
} from 'lucide-react';
import { AcknowledgeModal } from './AcknowledgeModal';
import { SwapRequestModal } from './SwapRequestModal';
import { ShareScheduleModal } from '../common/ShareScheduleModal';
import { EmergencyContactSheet } from './EmergencyContactSheet';

export const DayShiftCard: React.FC = () => {
  const {
    activeCollaboratorId,
    selectedDayDate,
    shifts,
  } = useSchedule();

  const [showAckModal, setShowAckModal] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEmergencySheet, setShowEmergencySheet] = useState(false);

  // Find shift
  const shift = shifts.find(
    (s) => s.collaboratorId === activeCollaboratorId && s.date === selectedDayDate
  );

  const dateObj = new Date(selectedDayDate + 'T12:00:00');
  const formattedFullDate = dateObj.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Capitalize first letter of weekday
  const capitalizedDate =
    formattedFullDate.charAt(0).toUpperCase() + formattedFullDate.slice(1);

  if (!shift) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-xs">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="font-bold text-sm text-slate-800">Sem escala definida</h4>
          <p className="text-xs text-slate-500 mt-1">
            Nenhuma atividade cadastrada para {capitalizedDate}.
          </p>
        </div>
      </div>
    );
  }

  const isDsr = shift.type === 'folga_dsr' || shift.type === 'folga';
  const isPlantao = shift.type === 'plantao';
  const isWork = shift.type === 'trabalho';

  return (
    <div className="p-3.5 space-y-3">
      {/* Main Shift Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Card Header with Day & Status */}
        <div className={`p-4 border-b ${
          isDsr 
            ? 'bg-emerald-50/70 border-emerald-100' 
            : isPlantao
              ? 'bg-purple-50/70 border-purple-100'
              : 'bg-blue-50/50 border-blue-100'
        }`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                {dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })}
              </span>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
              </h3>
            </div>

            {/* Shift Type Badge */}
            {isDsr && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>FOLGA (DSR)</span>
              </div>
            )}
            {isPlantao && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-bold shadow-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>PLANTÃO CCO</span>
              </div>
            )}
            {isWork && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold shadow-xs">
                <Bus className="w-3.5 h-3.5" />
                <span>ESCALA NORMAL</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content based on type */}
        {isDsr ? (
          /* DSR Content */
          <div className="p-5 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">
                Descanso Semanal Remunerado
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Dia livre de folga legal assegurado pela CLT (Art. 67). Aproveite o seu descanso com a família!
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-block text-[11px] font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                ✓ Conforme escala regulamentar
              </span>
            </div>
          </div>
        ) : (
          /* Work or Plantão Content */
          <div className="p-4 space-y-4">
            {/* Urgent Alert Banner (if any) */}
            {shift.urgentAlert && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold block">Aviso Importante do Tráfego:</span>
                  <span className="text-amber-800">{shift.urgentAlert}</span>
                </div>
              </div>
            )}

            {/* Time Grid Highlight */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Apresentação
                </span>
                <span className="text-lg font-black font-mono text-blue-700 block">
                  {shift.presentationTime || '05:30'}
                </span>
                <span className="text-[10px] text-slate-500">Pegada</span>
              </div>

              <div className="text-center border-x border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Jornada
                </span>
                <span className="text-sm font-black font-mono text-slate-800 block mt-0.5">
                  {shift.startTime || '05:45'} - {shift.endTime || '14:20'}
                </span>
                <span className="text-[10px] text-slate-500">Início e Fim</span>
              </div>

              <div className="text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Intervalo
                </span>
                <span className="text-sm font-bold font-mono text-slate-700 block mt-0.5">
                  {shift.breakDuration || '01:00'}
                </span>
                <span className="text-[10px] text-slate-500">Refeição</span>
              </div>
            </div>

            {/* Line & Client Information */}
            {shift.lineCode && (
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Linha / Itinerário
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {shift.lineCode}
                    </h4>
                    {shift.clientName && (
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-600">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span>Cliente: {shift.clientName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle & Plate */}
                {(shift.vehiclePrefix || shift.vehiclePlate) && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Veículo Designado
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-slate-900">
                          {shift.vehiclePrefix}
                        </span>
                        {shift.vehiclePlate && (
                          <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 font-mono text-[10px] font-bold border border-slate-300">
                            {shift.vehiclePlate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Locations: Departure and Arrival */}
                {shift.departureLocation && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 block">
                        Ponto de Apresentação / Saída
                      </span>
                      <span className="font-semibold text-slate-800">
                        {shift.departureLocation}
                      </span>
                      {shift.destinationLocation && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Destino final: {shift.destinationLocation}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Operational Notes */}
            {shift.notes && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Orientações da Operação:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {shift.notes}
                </p>
              </div>
            )}

            {/* Acknowledgement Status Section */}
            <div className="pt-1">
              {shift.acknowledged ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        Ciência de Escala Confirmada
                      </span>
                      <span className="text-[10px] text-emerald-800">
                        {shift.acknowledgedAt
                          ? `Registrado em ${new Date(shift.acknowledgedAt).toLocaleString('pt-BR')}`
                          : 'Registrado eletronicamente'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Homologado
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setShowAckModal(true)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Confirmar Ciência Desta Escala</span>
                  </button>
                  <p className="text-[10px] text-center text-slate-400">
                    Obrigatório confirmar ciência com antecedência mínima de 24h.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Buttons for Employee */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setShowSwapModal(true)}
          className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center gap-1 shadow-2xs"
        >
          <ArrowLeftRight className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] font-bold leading-tight">Pedir Troca (Permuta)</span>
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center gap-1 shadow-2xs"
        >
          <Share2 className="w-4 h-4 text-emerald-600" />
          <span className="text-[10px] font-bold leading-tight">Enviar WhatsApp</span>
        </button>

        <button
          onClick={() => setShowEmergencySheet(true)}
          className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center gap-1 shadow-2xs"
        >
          <Phone className="w-4 h-4 text-red-600" />
          <span className="text-[10px] font-bold leading-tight">CCO 24h / Tráfego</span>
        </button>
      </div>

      {/* Modals */}
      {showAckModal && (
        <AcknowledgeModal
          shift={shift}
          mode="single"
          onClose={() => setShowAckModal(false)}
        />
      )}

      {showSwapModal && (
        <SwapRequestModal
          initialDate={selectedDayDate}
          onClose={() => setShowSwapModal(false)}
        />
      )}

      {showShareModal && (
        <ShareScheduleModal onClose={() => setShowShareModal(false)} />
      )}

      {showEmergencySheet && (
        <EmergencyContactSheet onClose={() => setShowEmergencySheet(false)} />
      )}
    </div>
  );
};
