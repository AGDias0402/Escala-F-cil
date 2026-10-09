import { Collaborator, Shift, ShiftSwapRequest, OperationalNotice } from '../types/schedule';

export const INITIAL_COLLABORATORS: Collaborator[] = [
  {
    id: 'colab-1',
    name: 'Rodrigo Almeida Santos',
    matricula: 'MT-1042',
    role: 'Motorista Rodoviário',
    department: 'Fretamento Executivo',
    phone: '(11) 98765-4321',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
    cnhCategory: 'D',
    badgeColor: '#2563EB',
  },
  {
    id: 'colab-2',
    name: 'Lucas Martins Ferreira',
    matricula: 'MT-1088',
    role: 'Motorista de Fretamento',
    department: 'Fretamento Industrial',
    phone: '(11) 97412-3390',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    cnhCategory: 'D',
    badgeColor: '#059669',
  },
  {
    id: 'colab-3',
    name: 'Mariana Costa Ribeiro',
    matricula: 'MN-2015',
    role: 'Monitora de Transporte',
    department: 'Fretamento Escolar & Corporativo',
    phone: '(11) 99123-8876',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
    cnhCategory: 'B',
    badgeColor: '#D97706',
  },
  {
    id: 'colab-4',
    name: 'Anderson Vieira Lima',
    matricula: 'MT-0985',
    role: 'Motorista Reserva Especial',
    department: 'Plantão / CCO',
    phone: '(11) 98112-9900',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    cnhCategory: 'E',
    badgeColor: '#7C3AED',
  },
  {
    id: 'colab-5',
    name: 'Juliana Rocha Mendes',
    matricula: 'MT-1104',
    role: 'Motorista de Fretamento',
    department: 'Fretamento Noturno',
    phone: '(11) 96544-2130',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
    cnhCategory: 'D',
    badgeColor: '#DB2777',
  },
  {
    id: 'colab-6',
    name: 'Carlos Alberto Barreto',
    matricula: 'MT-0870',
    role: 'Motorista Rodoviário Sênior',
    department: 'Linha Intermunicipal / Turismo',
    phone: '(11) 98334-5511',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
    cnhCategory: 'E',
    badgeColor: '#0D9488',
  },
];

export const MANAGER_PROFILE = {
  id: 'gestor-1',
  name: 'Carlos Mendonça',
  role: 'Supervisor de Tráfego e Operações',
  matricula: 'SUP-001',
  department: 'Coordenação de Escalas e CCO',
  phone: '(11) 99988-7766',
  avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
};

// Helper: Formata data como YYYY-MM-DD
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Retorna o início da semana (Segunda-feira) para uma dada data ou semana de offset
export function getMondayOfWeek(offsetWeeks = 0): Date {
  const d = new Date();
  const day = d.getDay();
  // Se for domingo (0), no padrão Brasil a semana atual começa na segunda anterior
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) + (offsetWeeks * 7);
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Retorna os 7 dias da semana (Segunda a Domingo)
export function getWeekDates(offsetWeeks = 0): Date[] {
  const monday = getMondayOfWeek(offsetWeeks);
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    week.push(day);
  }
  return week;
}

// Gera dados iniciais de escala sincronizados com as semanas atual (-1, 0, +1)
export function generateInitialShifts(): Shift[] {
  const shifts: Shift[] = [];
  const weekOffsets = [-1, 0, 1]; // Semana passada, semana atual, próxima semana

  const routeTemplates = [
    {
      lineCode: 'LINHA 104 - COMPLEXO INDUSTRIAL ABC',
      clientName: 'Polo Petroquímico & Hub Logístico',
      vehiclePrefix: 'Prefixo 4210 (Marcopolo Viaggio)',
      vehiclePlate: 'BCA-9G40',
      presentationTime: '05:15',
      startTime: '05:40',
      endTime: '14:20',
      breakDuration: '01:00',
      departureLocation: 'Garagem Central - Max Tour',
      destinationLocation: 'Plataforma Sul - Portaria 3',
      notes: 'Realizar checklist do tacógrafo antes da partida.',
    },
    {
      lineCode: 'LINHA 208 - FRETAMENTO EXECUTIVO BERRINI',
      clientName: 'Edifício Infinity Tower / Alphaville',
      vehiclePrefix: 'Prefixo 3850 (Paradiso G8 1050)',
      vehiclePlate: 'FMT-2E11',
      presentationTime: '06:00',
      startTime: '06:30',
      endTime: '15:30',
      breakDuration: '01:15',
      departureLocation: 'Terminal Metrô Jabaquara',
      destinationLocation: 'Hub Empresarial Brooklin',
      notes: 'Ar-condicionado regulado em 22°C. Conferir crachá dos passageiros.',
    },
    {
      lineCode: 'LINHA 315 - TURNO VESPERTINO MAUA',
      clientName: 'Centro de Distribuição Mercado Livre',
      vehiclePrefix: 'Prefixo 4520 (Marcopolo Torino)',
      vehiclePlate: 'RXT-8H92',
      presentationTime: '13:30',
      startTime: '14:00',
      endTime: '22:45',
      breakDuration: '01:00',
      departureLocation: 'Garagem Sub-Base Mauá',
      destinationLocation: 'Plataforma CD-01 Galpão A',
      notes: 'Atenção aos horários de saída de turno de colaboradores.',
    },
    {
      lineCode: 'LINHA 402 - ROTA NOTURNA AEROPORTO GRU',
      clientName: 'LATAM Linhas Aéreas / Hangar',
      vehiclePrefix: 'Prefixo 5100 (Irizar i6 Rodoviário)',
      vehiclePlate: 'AIR-3C77',
      presentationTime: '21:00',
      startTime: '21:30',
      endTime: '06:00',
      breakDuration: '01:30',
      departureLocation: 'Estação Barra Funda',
      destinationLocation: 'Terminal de Cargas GRU Hangar 2',
      notes: 'Colete refletivo obrigatório na área de pátio restrito.',
    },
  ];

  weekOffsets.forEach((offset) => {
    const dates = getWeekDates(offset);

    // Para cada colaborador
    INITIAL_COLLABORATORS.forEach((colab, colabIdx) => {
      dates.forEach((dateObj, dayIdx) => {
        const dateStr = formatDateISO(dateObj);
        const shiftId = `shift-${colab.id}-${dateStr}`;

        // Definir folga DSR realista (ex: escala 6x1 ou 5x2)
        // Colab 1 folga no Domingo (dia 6)
        // Colab 2 folga no Sábado (dia 5)
        // Colab 3 folga no Domingo (dia 6) e Quarta (dia 2)
        // Colab 4 é plantão
        // Colab 5 folga na Segunda (dia 0)
        // Colab 6 folga no Domingo (dia 6)
        let isDsr = false;
        let isPlantao = false;

        if (colabIdx === 0 && dayIdx === 6) isDsr = true;
        if (colabIdx === 1 && dayIdx === 5) isDsr = true;
        if (colabIdx === 2 && (dayIdx === 6 || dayIdx === 2)) isDsr = true;
        if (colabIdx === 3 && (dayIdx === 1 || dayIdx === 4)) isPlantao = true;
        if (colabIdx === 3 && dayIdx === 6) isDsr = true;
        if (colabIdx === 4 && dayIdx === 0) isDsr = true;
        if (colabIdx === 5 && dayIdx === 6) isDsr = true;

        if (isDsr) {
          shifts.push({
            id: shiftId,
            collaboratorId: colab.id,
            date: dateStr,
            type: 'folga_dsr',
            notes: 'Descanso Semanal Remunerado regulamentar (DSR CLT).',
            acknowledged: offset <= 0,
            acknowledgedAt: offset <= 0 ? '2026-10-06T08:00:00Z' : undefined,
          });
        } else if (isPlantao) {
          shifts.push({
            id: shiftId,
            collaboratorId: colab.id,
            date: dateStr,
            type: 'plantao',
            presentationTime: '07:00',
            startTime: '07:00',
            endTime: '16:00',
            departureLocation: 'CCO Garagem Central - Sala de Reserva',
            notes: 'Sobreaviso para cobertura de linhas extraordinárias e socorro.',
            acknowledged: offset <= 0,
            acknowledgedAt: offset <= 0 ? '2026-10-06T08:00:00Z' : undefined,
          });
        } else {
          // Trabalho regular
          const route = routeTemplates[(colabIdx + dayIdx) % routeTemplates.length];
          const hasNotice = dayIdx === 3 && colabIdx === 0; // Ex: Quarta do Colab 1 com aviso
          shifts.push({
            id: shiftId,
            collaboratorId: colab.id,
            date: dateStr,
            type: 'trabalho',
            lineCode: route.lineCode,
            clientName: route.clientName,
            vehiclePrefix: route.vehiclePrefix,
            vehiclePlate: route.vehiclePlate,
            presentationTime: route.presentationTime,
            startTime: route.startTime,
            endTime: route.endTime,
            breakDuration: route.breakDuration,
            departureLocation: route.departureLocation,
            destinationLocation: route.destinationLocation,
            notes: route.notes,
            urgentAlert: hasNotice ? 'Atenção: Desvio temporário no km 24 da Rodovia devido a recapeamento da pista.' : undefined,
            // Colaborador 1 na semana atual pode estar parcialmente confirmado para testar a ação
            acknowledged: offset < 0 ? true : (offset === 0 ? (colabIdx !== 0 || dayIdx < 2) : false),
            acknowledgedAt: (offset < 0 || (offset === 0 && colabIdx !== 0)) ? '2026-10-06T09:15:22Z' : undefined,
          });
        }
      });
    });
  });

  return shifts;
}

export const INITIAL_SWAP_REQUESTS: ShiftSwapRequest[] = [
  {
    id: 'swap-1',
    requesterId: 'colab-1',
    requesterDate: formatDateISO(getWeekDates(0)[4]), // Sexta-feira
    targetCollaboratorId: 'colab-2',
    targetDate: formatDateISO(getWeekDates(0)[5]), // Sábado
    reason: 'Consulta médica agendada no período da manhã no Hospital São Camilo.',
    status: 'pendente',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'swap-2',
    requesterId: 'colab-3',
    requesterDate: formatDateISO(getWeekDates(0)[3]), // Quinta-feira
    targetCollaboratorId: 'colab-5',
    targetDate: formatDateISO(getWeekDates(0)[1]), // Terça
    reason: 'Ajuste de horário para compromisso familiar de formatura escolar.',
    status: 'aprovado',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    reviewedAt: new Date(Date.now() - 86400000).toISOString(),
    reviewedBy: 'Carlos Mendonça (Supervisor)',
  },
];

export const INITIAL_NOTICES: OperationalNotice[] = [
  {
    id: 'notice-1',
    title: 'Fechamento da Escala Semanal de Feriado',
    message: 'A escala do feriado já está publicada no sistema. Todos os colaboradores devem confirmar ciência até quinta-feira às 18h.',
    date: 'Hoje, 08:30',
    author: 'Tráfego Max Tour',
    priority: 'alta',
    targetAudience: 'todos',
  },
  {
    id: 'notice-2',
    title: 'Recadastramento do Cartão de Abastecimento',
    message: 'Dirigir-se ao CCO após o término da jornada para atualização do chip do cartão Shell Frota.',
    date: 'Ontem, 16:45',
    author: 'CCO Operacional',
    priority: 'normal',
    targetAudience: 'motoristas',
  },
];
