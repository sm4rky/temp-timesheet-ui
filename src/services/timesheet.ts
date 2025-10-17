import { ITimesheet } from "@/interfaces/timesheet";
import http from "@/services/api";

const PREFIX_PATH = "/api/timesheets";

const timesheetService = {
  createTimesheet: async (data: ITimesheet): Promise<ITimesheet> => {
    const response = (await http.post<ITimesheet>(`${PREFIX_PATH}`, data)).data;
    return response;
  },
};

export default timesheetService;
