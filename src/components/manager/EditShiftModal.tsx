import React, { useState } from 'react';
import { useSchedule } from '../../context/ScheduleContext';
import { Shift, ShiftType } from '../../types/schedule';
import { Edit3, Check, X, Bus, Calendar, Clock, MapPin, Building2, AlertTriangle } from 'lucide-react';
import { formatDateISO } from '../../data/mockData';

interface EditShiftModalProps {
  initialShift?: Shift;
  initialCollaboratorId?: string;
  initialDate?: string;
  onClose: () => void;
}

export const EditShiftModal: React.FC<EditShiftModalProps> = ({
  initialShift,
  initialCollaboratorId,
  initialDate,
  onClose,
}) => {
  const {
    collaborators,
    updateShift,
  } = useSchedule();

  const [collaboratorId, setCollaboratorId] = useState(
    initialShift?.collaboratorId || initialCollaboratorId || collaborators[0]?.id || ''
  );
  const [date, setDate] = useState(
    initialShift?.date || initialDate || formatDateISO(new Date())
  );
  const [type, setType] = useState<ShiftType>(initialShift?.type || 'trabalho');
  const [lineCode, setLineCode] = useState(initialShift?.lineCode || 'LINHA 104 - COMPLEXO INDUSTRIAL ABC');
  const [clientName, setClientName] = useState(initialShift?.clientName || 'Polo Petroquímico');
  const [vehiclePrefix, setVehiclePrefix] = useState(initialShift?.vehiclePrefix || 'Prefixo 4210');
  const [vehiclePlate, setVehiclePlate] = useState(initialShift?.vehiclePlate || 'BCA-9G40');
  const [presentationTime, setPresentationTime] = useState(initialShift?.presentationTime || '05:15');
  const [startTime, setStartTime] = useState(initialShift?.startTime || '05:40');
  const [endTime, setEndTime] = useState(initialShift?.endTime || '14:20');
  const [breakDuration, setBreakDuration] = useState(initialShift?.breakDuration || '01:00');
  const [departureLocation, setDepartureLocation] = useState(initialShift?.departureLocation || 'Garagem Central - Max Tour');
  const [destinationLocation, setDestinationLocation] = useState(initialShift?.destinationLocation || 'Portaria Principal');
  const [notes, setNotes] = useState(initialShift?.notes || '');
  const [urgentAlert, setUrgentAlert] = useState(initialShift?.urgentAlert || '');

  // Presets
  const applyPreset = (presetType: 'dsr' | 'plantao' | 'manha' | 'tarde') => {
    if (presetType === 'dsr') {
      setType('folga_dsr');
      setNotes('Descanso Semanal Remunerado regulamentar.');
    } else if (presetType === 'plantao') {
      setType('plantao');
      setPresentationTime('07:00');
      setStartTime('07:00');
      setEndTime('16:00');
      setDepartureLocation('Garagem Central - CCO');
      setNotes('Plantão de sobreaviso e cobertura emergencial.');
    } else if (presetType === 'manha') {
      setType('trabalho');
      setPresentationTime('05:15');
      setStartTime('05:40');
      setEndTime('14:20');
      setLineCode('LINHA 104 - COMPLEXO INDUSTRIAL ABC');
      setVehiclePrefix('Prefixo 4210');
      setVehiclePlate('BCA-9G40');
    } else if (presetType === 'tarde') {
      setType('trabalho');
      setPresentationTime('13:30');
      setStartTime('14:00');
      setEndTime('22:30');
      setLineCode('LINHA 315 - TURNO VESPERTINO MAUA');
      setVehiclePrefix('Prefixo 4520');
      setVehiclePlate('RXT-8H92');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: Shift = {
      id: initialShift?.id || `shift-${collaboratorId}-${date}`,
      collaboratorId,
      date,
      type,
      lineCode: type === 'trabalho' ? lineCode : undefined,
      clientName: type === 'trabalho' ? clientName : undefined,
      vehiclePrefix: type === 'trabalho' ? vehiclePrefix : undefined,
      vehiclePlate: type === 'trabalho' ? vehiclePlate : undefined,
      presentationTime: (type === 'trabalho' || type === 'plantao') ? presentationTime : undefined,
      startTime: (type === 'trabalho' || type === 'plantao') ? startTime : undefined,
      endTime: (type === 'trabalho' || type === 'plantao') ? endTime : undefined,
      breakDuration: type === 'trabalho' ? breakDuration : undefined,
      departureLocation: (type === 'trabalho' || type === 'plantao') ? departureLocation : undefined,
      destinationLocation: type === 'trabalho' ? destinationLocation : undefined,
      notes: notes.trim() || undefined,
      urgentAlert: urgentAlert.trim() || undefined,
      // If the manager modifies the shift, reset acknowledgement so collaborator verifies
      acknowledged: false,
      acknowledgedAt: undefined,
    };

    updateShift(updated);
    onClose();
  };

  const colabObj = collaborators.find((c) => c.id === collaboratorId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Editar / Escalar Colaborador</h3>
              <p className="text-[11px] text-slate-400">
                {colabObj ? `${colabObj.name} (${colabObj.matricula})` : 'Definição de Turno'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Quick Presets */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Modelos Rápidos (1-Clique):
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('dsr')}
                className="py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-[10px]"
              >
                Folga DSR
              </button>
              <button
                type="button"
                onClick={() => applyPreset('plantao')}
                className="py-1 px-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-semibold text-[10px]"
              >
                Plantão CCO
              </button>
              <button
                type="button"
                onClick={() => applyPreset('manha')}
                className="py-1 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-semibold text-[10px]"
              >
                Turno Manhã
              </button>
              <button
                type="button"
                onClick={() => applyPreset('tarde')}
                className="py-1 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-[10px]"
              >
                Turno Tarde
              </button>
            </div>
          </div>

          {/* Collaborator & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Colaborador:</label>
              <select
                value={collaboratorId}
                onChange={(e) => setCollaboratorId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                {collaborators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.matricula})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Data da Escala:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Shift Type */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tipo de Escala:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('trabalho')}
                className={`py-2 px-2 rounded-xl font-bold border text-center transition-all ${
                  type === 'trabalho'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Trabalho Normal
              </button>
              <button
                type="button"
                onClick={() => setType('folga_dsr')}
                className={`py-2 px-2 rounded-xl font-bold border text-center transition-all ${
                  type === 'folga_dsr'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Folga DSR (CLT)
              </button>
              <button
                type="button"
                onClick={() => setType('plantao')}
                className={`py-2 px-2 rounded-xl font-bold border text-center transition-all ${
                  type === 'plantao'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Plantão / Reserva
              </button>
            </div>
          </div>

          {/* Details for Trabalho or Plantão */}
          {type !== 'folga_dsr' && type !== 'folga' && (
            <div className="space-y-3 pt-1 border-t border-slate-200">
              {/* Times */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Apresentação:</label>
                  <input
                    type="time"
                    value={presentationTime}
                    onChange={(e) => setPresentationTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Início Viagem:</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Término:</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-1.5 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Line & Client */}
              {type === 'trabalho' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Linha / Rota:</label>
                      <input
                        type="text"
                        value={lineCode}
                        onChange={(e) => setLineCode(e.target.value)}
                        placeholder="Ex: LINHA 104 - ROTA ABC"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Cliente / Destino:</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ex: Polo Industrial / Mercado Livre"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Prefixo do Veículo:</label>
                      <input
                        type="text"
                        value={vehiclePrefix}
                        onChange={(e) => setVehiclePrefix(e.target.value)}
                        placeholder="Ex: Prefixo 4210 (G8)"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Placa:</label>
                      <input
                        type="text"
                        value={vehiclePlate}
                        onChange={(e) => setVehiclePlate(e.target.value)}
                        placeholder="Ex: BRA-4X90"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-mono uppercase focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Locations */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ponto de Apresentação:</label>
                <input
                  type="text"
                  value={departureLocation}
                  onChange={(e) => setDepartureLocation(e.target.value)}
                  placeholder="Ex: Garagem Central - Max Tour"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Operational Urgent Alert */}
              <div>
                <label className="block font-bold text-amber-800 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Aviso Importante / Alerta de Rota (Opcional):</span>
                </label>
                <input
                  type="text"
                  value={urgentAlert}
                  onChange={(e) => setUrgentAlert(e.target.value)}
                  placeholder="Ex: Desvio de rota devido a obras na Rodovia"
                  className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-2.5 py-1.5 text-xs text-amber-950 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações Internas:</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Orientações específicas para o colaborador..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Footer Save */}
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
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Escala</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
