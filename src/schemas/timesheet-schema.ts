import { z } from "zod";

export const timesheetSchema = z.object({
  date: z.coerce.date(),
  project: z.number(),
  billableHours: z.coerce
    .number()
    .min(0)
    .max(4, { message: "Billable hours cannot exceed 4" }),
  nonBillableHours: z.coerce
    .number()
    .min(0)
    .max(4, { message: "Non-billable hours cannot exceed 4" }),
  taskDescription: z
    .string()
    .trim()
    .min(1, { message: "Task description cannot be empty" }),
});

export type ITimesheet = z.output<typeof timesheetSchema>;
