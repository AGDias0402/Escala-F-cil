export type UserRole = 'colaborador' | 'gestor';

export type ShiftType = 
  | 'trabalho'      // Jornada normal escalada
  | 'folga'         // Folga normal
  | 'folga_dsr'     // Descanso Semanal Remunerado
  | 'plantao'       // De sobreaviso / plantão na garagem
  | 'ferias'        // Em férias regulamentares
  | 'afastado';     // Atestado médico / licença

export interface Collaborator {
  id: string;
  name: string;
  matricula: string;
  role: string;
  department: string;
  phone: string;
  avatar: string;
  cnhCategory?: string;
  badgeColor?: string;
}

export interface Shift {
  id: string;
  collaboratorId: string;
  date: string; // Formato YYYY-MM-DD
  type: ShiftType;
  lineCode?: string;         // Ex: "LINHA 102 - ALPHAVILLE"
  clientName?: string;       // Ex: "Tech Park / Hub Corporativo"
  vehiclePrefix?: string;    // Ex: "Prefixo 4120"
  vehiclePlate?: string;     // Ex: "BRA-4F29"
  presentationTime?: string; // Horário de pegada na garagem (ex: "05:15")
  startTime?: string;        // Início da viagem/jornada (ex: "05:40")
  endTime?: string;          // Término da jornada (ex: "14:20")
  breakDuration?: string;    // Ex: "01:00"
  departureLocation?: string;// Ex: "Garagem Central - Setor C"
  destinationLocation?: string; // Ex: "Terminal Rodoviário Central"
  notes?: string;
  urgentAlert?: string;
  acknowledged: boolean;     // Se o colaborador já deu ciência
  acknowledgedAt?: string;   // Timestamp ISO
}

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requesterDate: string;
  targetCollaboratorId: string;
  targetDate: string;
  reason: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface OperationalNotice {
  id: string;
  title: string;
  message: string;
  date: string;
  author: string;
  priority: 'normal' | 'alta' | 'urgente';
  targetAudience: 'todos' | 'motoristas' | 'monitores';
}
