import { IProject } from "@/interfaces/project";

interface ITimesheet {
  id?: number;
  date: Date;
  project: IProject;
  billableHours: number;
  nonBillableHours: number;
  taskDescription: string;
}

export type { ITimesheet };
