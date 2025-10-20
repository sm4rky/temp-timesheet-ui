import http from "@/services/api";
import { ILeaveBalance } from "@/interfaces/leaveBalance";
import { getUserEmail } from "@/services/user";

const PREFIX_PATH = "/api/leave-balance";

const leaveBalanceService = {
  getLeaveBalance: async (): Promise<ILeaveBalance> => {
    const response = await http.get<ILeaveBalance>(`${PREFIX_PATH}`, {
      headers: { "X-User-Email": getUserEmail() },
    });
    return response.data;
  },

  useLeave: async (usedDays: number): Promise<ILeaveBalance> => {
    const response = await http.patch<ILeaveBalance>(`${PREFIX_PATH}/use`, null, {
      params: { usedDays }, // ?usedDays=#
      headers: { "X-User-Email": getUserEmail() },
    });
    return response.data;
  },

  resetLeave: async (carryOver: number): Promise<ILeaveBalance> => {
    const response = await http.patch<ILeaveBalance>(`${PREFIX_PATH}/reset`, null, {
      params: { carryOver }, // ?carryOver=#
      headers: { "X-User-Email": getUserEmail() },
    });
    return response.data;
  },
};

export default leaveBalanceService;
