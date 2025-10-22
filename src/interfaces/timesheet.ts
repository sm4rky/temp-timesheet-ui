import { IProject } from "@/interfaces/project";

/** Server response (TimesheetResponseDto) */
export interface ITimesheet {
  id: number;
  date: string; // yyyy-mm-dd from LocalDate
  project: IProject | null;
  billableHours: number;
  nonBillableHours: number;
  taskDescription: string;
}

/** Server request (TimesheetRequestDto) */
export interface ITimesheetRequest {
  projectId: number;
  date: string; // yyyy-mm-dd ONLY
  billableHours: number;   // 0..4
  nonBillableHours: number; // 0..4
  taskDescription: string;
}
