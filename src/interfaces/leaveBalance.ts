export interface ILeaveBalance {
  id: number;
  userEmail: string;
  carriedOverDays: number;
  currentYearDays: number;
  usedPtoDays: number;
  lastUpdated: string; // ISO date (LocalDate)
  leaveBalance: number; // computed by backend
}
