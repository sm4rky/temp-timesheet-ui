export interface IHolidayResponse {
  id: number;
  holidayName: string;
  holidayDate: string; // "YYYY-MM-DD"
  description?: string | null;
}

export interface IHolidayRequest {
  id: number;
  holidayName: string;
  holidayDate: string; // "YYYY-MM-DD"
  description?: string | null;
}
