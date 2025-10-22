import { ITimesheet, ITimesheetRequest } from "@/interfaces/timesheet";
import http from "@/services/api";
import { getUserEmail } from "@/services/user";

const PREFIX_PATH = "/api/timesheets";

function withUserHeader() {
  const email = getUserEmail();
  return email ? { headers: { "X-User-Email": email } } : {};
}

const timesheetService = {
  createTimesheet: async (data: ITimesheetRequest): Promise<ITimesheet> => {
    const res = await http.post<ITimesheet>(`${PREFIX_PATH}`, data, withUserHeader());
    return res.data;
  },

  /** All users (admin-style listing) */
  getAllTimesheets: async (): Promise<ITimesheet[]> => {
    const res = await http.get<ITimesheet[]>(`${PREFIX_PATH}`);
    return res.data;
  },

  /** Current user only (preferred for Home list) */
  getTimesheetsByUser: async (): Promise<ITimesheet[]> => {
    const res = await http.get<ITimesheet[]>(`${PREFIX_PATH}/user`, withUserHeader());
    return res.data;
  },
};

export default timesheetService;
