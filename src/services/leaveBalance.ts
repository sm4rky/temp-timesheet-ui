import http from "@/services/api";
import { ILeaveBalance } from "@/interfaces/leaveBalance";
import { getUserEmail } from "@/services/user";

const PREFIX = "/api/leave-balance";

function withUserHeader() {
  const email = getUserEmail();
  return email ? { headers: { "X-User-Email": email } } : {};
}

const leaveBalanceService = {
  /** GET /api/leave-balance (requires X-User-Email) */
  getLeaveBalance: async (): Promise<ILeaveBalance> => {
    const res = await http.get<ILeaveBalance>(`${PREFIX}`, withUserHeader());
    return res.data;
  },

  /** PATCH /api/leave-balance/use?usedDays=n (increments usedPtoDays) */
  useLeave: async (usedDays: number): Promise<ILeaveBalance> => {
    const res = await http.patch<ILeaveBalance>(
      `${PREFIX}/use`,
      null,
      {
        ...withUserHeader(),
        params: { usedDays },
      }
    );
    return res.data;
  },

  /** PATCH /api/leave-balance/reset?carryOver=n (resets for new year) */
  resetYearlyBalance: async (carryOver: number): Promise<ILeaveBalance> => {
    const res = await http.patch<ILeaveBalance>(
      `${PREFIX}/reset`,
      null,
      {
        ...withUserHeader(),
        params: { carryOver },
      }
    );
    return res.data;
  },
};

export default leaveBalanceService;
