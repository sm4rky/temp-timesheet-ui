export interface ILeaveBalance {
  id: number;
  userEmail: string;
  carriedOverDays: number;
  currentYearDays: number;
  usedPtoDays: number;
  lastUpdated: string;   // ISO date
  // computed from backend via @Transient getter
  leaveBalance: number;
}
