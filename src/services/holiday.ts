import { IHoliday } from "@/interfaces/holiday";
import http from "@/services/api";

const PREFIX_PATH = "/api/holidays";

function mapHoliday(raw: any): IHoliday {
  return {
    id: Number(raw.id),
    holidayName: String(raw.holidayName ?? raw.holiday_name ?? ""),
    holidayDate: String(raw.holidayDate ?? raw.holiday_date ?? ""),
    description: raw.description ?? null,
  };
}

const holidayService = {
  getAllHolidays: async (): Promise<IHoliday[]> => {
    const res = await http.get<any[]>(`${PREFIX_PATH}`);
    const data = res.data ?? [];
    return Array.isArray(data) ? data.map(mapHoliday) : [];
  },

  createHoliday: async (payload: IHoliday): Promise<IHoliday> => {
    const res = await http.post(`${PREFIX_PATH}`, payload);
    return mapHoliday(res.data);
  },
}

export default holidayService;

