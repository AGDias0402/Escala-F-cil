import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Collaborator, 
  Shift, 
  ShiftSwapRequest, 
  OperationalNotice, 
  UserRole 
} from '../types/schedule';
import { 
  INITIAL_COLLABORATORS, 
  generateInitialShifts, 
  INITIAL_SWAP_REQUESTS, 
  INITIAL_NOTICES,
  formatDateISO,
  getWeekDates 
} from '../data/mockData';

interface ScheduleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeCollaborator: Collaborator;
  activeCollaboratorId: string;
  setActiveCollaboratorId: (id: string) => void;
  collaborators: Collaborator[];
  shifts: Shift[];
  swapRequests: ShiftSwapRequest[];
  notices: OperationalNotice[];
  currentWeekOffset: number;
  setCurrentWeekOffset: (offset: number) => void;
  selectedDayDate: string;
  setSelectedDayDate: (date: string) => void;
  deviceFrameMode: 'mobile-frame' | 'responsive';
  setDeviceFrameMode: (mode: 'mobile-frame' | 'responsive') => void;
  
  // Actions
  acknowledgeShift: (shiftId: string) => void;
  acknowledgeAllWeek: (collaboratorId: string, weekOffset: number) => void;
  createSwapRequest: (data: {
    requesterDate: string;
    targetCollaboratorId: string;
    targetDate: string;
    reason: string;
  }) => void;
  approveSwapRequest: (swapId: string) => void;
  rejectSwapRequest: (swapId: string) => void;
  updateShift: (updatedShift: Shift) => void;
  addNotice: (notice: Omit<OperationalNotice, 'id'>) => void;
  resetAllData: () => void;
  
  // Queries
  getShiftsForCollaboratorWeek: (collaboratorId: string, weekOffset: number) => Shift[];
  getWeekStats: (weekOffset: number) => {
    totalEmployees: number;
    totalActiveShifts: number;
    acknowledgedCount: number;
    pendingCount: number;
    acknowledgementRate: number;
    dsrCount: number;
    swapPendingCount: number;
  };
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SHIFTS: 'escalamax_shifts_v1',
  SWAPS: 'escalamax_swaps_v1',
  NOTICES: 'escalamax_notices_v1',
  ROLE: 'escalamax_role_v1',
  ACTIVE_COLAB: 'escalamax_active_colab_v1',
  DEVICE_MODE: 'escalamax_device_mode_v1',
};

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collaborators] = useState<Collaborator[]>(INITIAL_COLLABORATORS);
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as UserRole) || 'colaborador';
  });

  const [activeCollaboratorId, setActiveCollaboratorIdState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_COLAB) || 'colab-1';
  });

  const [deviceFrameMode, setDeviceFrameModeState] = useState<'mobile-frame' | 'responsive'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.DEVICE_MODE) as 'mobile-frame' | 'responsive') || 'mobile-frame';
  });

  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);

  // Default to today's date ISO
  const [selectedDayDate, setSelectedDayDate] = useState<string>(() => {
    return formatDateISO(new Date());
  });

  // Shifts state
  const [shifts, setShifts] = useState<Shift[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return generateInitialShifts();
  });

  // Swaps state
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SWAPS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_SWAP_REQUESTS;
  });

  // Notices state
  const [notices, setNotices] = useState<OperationalNotice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_NOTICES;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SWAPS, JSON.stringify(swapRequests));
  }, [swapRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  }, [notices]);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(STORAGE_KEYS.ROLE, role);
  };

  const setActiveCollaboratorId = (id: string) => {
    setActiveCollaboratorIdState(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COLAB, id);
  };

  const setDeviceFrameMode = (mode: 'mobile-frame' | 'responsive') => {
    setDeviceFrameModeState(mode);
    localStorage.setItem(STORAGE_KEYS.DEVICE_MODE, mode);
  };

  const activeCollaborator = 
    collaborators.find((c) => c.id === activeCollaboratorId) || collaborators[0];

  // Acknowledge single shift
  const acknowledgeShift = (shiftId: string) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? { ...s, acknowledged: true, acknowledgedAt: new Date().toISOString() }
          : s
      )
    );
  };

  // Acknowledge whole week for a collaborator
  const acknowledgeAllWeek = (collaboratorId: string, weekOffset: number) => {
    const weekDates = getWeekDates(weekOffset).map(formatDateISO);
    const nowIso = new Date().toISOString();

    setShifts((prev) =>
      prev.map((s) => {
        if (s.collaboratorId === collaboratorId && weekDates.includes(s.date)) {
          return {
            ...s,
            acknowledged: true,
            acknowledgedAt: s.acknowledgedAt || nowIso,
          };
        }
        return s;
      })
    );
  };

  // Create swap request
  const createSwapRequest = (data: {
    requesterDate: string;
    targetCollaboratorId: string;
    targetDate: string;
    reason: string;
  }) => {
    const newSwap: ShiftSwapRequest = {
      id: `swap-${Date.now()}`,
      requesterId: activeCollaboratorId,
      requesterDate: data.requesterDate,
      targetCollaboratorId: data.targetCollaboratorId,
      targetDate: data.targetDate,
      reason: data.reason,
      status: 'pendente',
      createdAt: new Date().toISOString(),
    };
    setSwapRequests((prev) => [newSwap, ...prev]);
  };

  // Approve swap request
  const approveSwapRequest = (swapId: string) => {
    const swap = swapRequests.find((s) => s.id === swapId);
    if (!swap) return;

    // Perform the swap between shifts of requester and target on those dates
    setShifts((prev) => {
      const shiftReq = prev.find(
        (s) => s.collaboratorId === swap.requesterId && s.date === swap.requesterDate
      );
      const shiftTarget = prev.find(
        (s) => s.collaboratorId === swap.targetCollaboratorId && s.date === swap.targetDate
      );

      if (!shiftReq || !shiftTarget) return prev;

      // Exchange the workload / route details while maintaining date & collaboratorId
      return prev.map((s) => {
        if (s.id === shiftReq.id) {
          return {
            ...s,
            type: shiftTarget.type,
            lineCode: shiftTarget.lineCode,
            clientName: shiftTarget.clientName,
            vehiclePrefix: shiftTarget.vehiclePrefix,
            vehiclePlate: shiftTarget.vehiclePlate,
            presentationTime: shiftTarget.presentationTime,
            startTime: shiftTarget.startTime,
            endTime: shiftTarget.endTime,
            breakDuration: shiftTarget.breakDuration,
            departureLocation: shiftTarget.departureLocation,
            destinationLocation: shiftTarget.destinationLocation,
            notes: `[Permuta Aprovada c/ ${collaborators.find(c => c.id === swap.targetCollaboratorId)?.name}] ${shiftTarget.notes || ''}`,
            acknowledged: false, // Re-acknowledgement required after swap
            acknowledgedAt: undefined,
          };
        }
        if (s.id === shiftTarget.id) {
          return {
            ...s,
            type: shiftReq.type,
            lineCode: shiftReq.lineCode,
            clientName: shiftReq.clientName,
            vehiclePrefix: shiftReq.vehiclePrefix,
            vehiclePlate: shiftReq.vehiclePlate,
            presentationTime: shiftReq.presentationTime,
            startTime: shiftReq.startTime,
            endTime: shiftReq.endTime,
            breakDuration: shiftReq.breakDuration,
            departureLocation: shiftReq.departureLocation,
            destinationLocation: shiftReq.destinationLocation,
            notes: `[Permuta Aprovada c/ ${collaborators.find(c => c.id === swap.requesterId)?.name}] ${shiftReq.notes || ''}`,
            acknowledged: false, // Re-acknowledgement required after swap
            acknowledgedAt: undefined,
          };
        }
        return s;
      });
    });

    setSwapRequests((prev) =>
      prev.map((s) =>
        s.id === swapId
          ? {
              ...s,
              status: 'aprovado',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Carlos Mendonça (Coord. Tráfego)',
            }
          : s
      )
    );
  };

  // Reject swap request
  const rejectSwapRequest = (swapId: string) => {
    setSwapRequests((prev) =>
      prev.map((s) =>
        s.id === swapId
          ? {
              ...s,
              status: 'rejeitado',
              reviewedAt: new Date().toISOString(),
              reviewedBy: 'Carlos Mendonça (Coord. Tráfego)',
            }
          : s
      )
    );
  };

  // Update shift
  const updateShift = (updatedShift: Shift) => {
    setShifts((prev) => {
      const exists = prev.some((s) => s.id === updatedShift.id);
      if (exists) {
        return prev.map((s) => (s.id === updatedShift.id ? updatedShift : s));
      }
      return [...prev, updatedShift];
    });
  };

  // Add notice
  const addNotice = (noticeData: Omit<OperationalNotice, 'id'>) => {
    const newNotice: OperationalNotice = {
      id: `notice-${Date.now()}`,
      ...noticeData,
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  // Reset all
  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.SHIFTS);
    localStorage.removeItem(STORAGE_KEYS.SWAPS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    setShifts(generateInitialShifts());
    setSwapRequests(INITIAL_SWAP_REQUESTS);
    setNotices(INITIAL_NOTICES);
  };

  // Query: shifts for a collaborator in a given week
  const getShiftsForCollaboratorWeek = (collaboratorId: string, weekOffset: number) => {
    const weekDates = getWeekDates(weekOffset).map(formatDateISO);
    return shifts.filter(
      (s) => s.collaboratorId === collaboratorId && weekDates.includes(s.date)
    );
  };

  // Query: stats for a given week
  const getWeekStats = (weekOffset: number) => {
    const weekDates = getWeekDates(weekOffset).map(formatDateISO);
    const weekShifts = shifts.filter((s) => weekDates.includes(s.date));
    
    const activeWorkShifts = weekShifts.filter((s) => s.type === 'trabalho' || s.type === 'plantao');
    const acknowledgedCount = activeWorkShifts.filter((s) => s.acknowledged).length;
    const pendingCount = activeWorkShifts.length - acknowledgedCount;
    const dsrCount = weekShifts.filter((s) => s.type === 'folga_dsr' || s.type === 'folga').length;
    const swapPendingCount = swapRequests.filter((s) => s.status === 'pendente').length;
    const rate = activeWorkShifts.length > 0 ? Math.round((acknowledgedCount / activeWorkShifts.length) * 100) : 100;

    return {
      totalEmployees: collaborators.length,
      totalActiveShifts: activeWorkShifts.length,
      acknowledgedCount,
      pendingCount,
      acknowledgementRate: rate,
      dsrCount,
      swapPendingCount,
    };
  };

  return (
    <ScheduleContext.Provider
      value={{
        userRole,
        setUserRole,
        activeCollaborator,
        activeCollaboratorId,
        setActiveCollaboratorId,
        collaborators,
        shifts,
        swapRequests,
        notices,
        currentWeekOffset,
        setCurrentWeekOffset,
        selectedDayDate,
        setSelectedDayDate,
        deviceFrameMode,
        setDeviceFrameMode,
        acknowledgeShift,
        acknowledgeAllWeek,
        createSwapRequest,
        approveSwapRequest,
        rejectSwapRequest,
        updateShift,
        addNotice,
        resetAllData,
        getShiftsForCollaboratorWeek,
        getWeekStats,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};
