import * as z from "zod";

/** yyyy-mm-dd */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const timesheetSchema = z.object({
  date: z.string().regex(DATE_REGEX, { message: "Date must be YYYY-MM-DD" }),
  project: z.number().int().min(0, { message: "Select a project" }),

  // Coerce form strings to numbers and validate range
  billableHours: z.coerce
    .number()
    .min(0, { message: "Min 0" })
    .max(4, { message: "Max 4" }),

  nonBillableHours: z.coerce
    .number()
    .min(0, { message: "Min 0" })
    .max(4, { message: "Max 4" }),

  taskDescription: z.string().min(1, { message: "Required" }).max(500),
});

export type TimesheetFormValues = z.input<typeof timesheetSchema>;
export type TimesheetSubmit = z.output<typeof timesheetSchema>;
