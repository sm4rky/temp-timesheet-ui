export interface IHoliday {
  id: number;
  holidayName: string;
  holidayDate: string; // "YYYY-MM-DD"
  description: string;
}

export interface IHolidayRequest {
  id: number;
  holidayName: string;
  holidayDate: string; // "YYYY-MM-DD"
  description?: string | null;
}
