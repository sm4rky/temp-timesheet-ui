import { IProject } from "@/interfaces/project";

export interface ITimesheet {
  id: number;
  date: string; // yyyy-mm-dd from LocalDate
  project: IProject;
  billableHours: number;
  nonBillableHours: number;
  taskDescription: string;
}

export interface ITimesheetRequest {
  projectId: number;
  date: string; // yyyy-mm-dd ONLY
  billableHours: number;   // 0..4
  nonBillableHours: number; // 0..4
  taskDescription: string;
}
