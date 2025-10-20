export interface IHoliday {
  id: number;
  holidayName: string;
  holidayDate: string; // "YYYY-MM-DD"
  description?: string | null;
}
