import { useRouter } from "next/router";
import { Button } from "@/components/shadcn/button";
import { Calendar, ArrowUpDown, Plus, TreePalm, RefreshCw } from "lucide-react";
import TimesheetCard from "@/components/Home/timesheet-card";
import timesheetService from "@/services/timesheet";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/providers/ThemeProvider";

export default function HomePage() {
  const router = useRouter();
  const { toggleTheme } = useTheme();

  const { data: timesheets, isLoading } = useQuery({
    queryKey: ["find-all-timesheets"],
    queryFn: timesheetService.getAllTimesheets,
  });

  return (
    // Fill the frame; prevent page-wide scroll. Only the list scrolls.
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Fixed header (always visible) */}
      <div className="shrink-0 bg-secondary text-primary px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="text-primary p-0"
              onClick={() => router.push("/Timeoff")}
            >
              <TreePalm />
            </Button>
            <Button
              variant="ghost"
              className="text-primary p-0"
              onClick={() => router.push("/Holiday")}
            >
              <Calendar />
            </Button>
            <Button variant="ghost" className="text-primary p-0">
              <RefreshCw />
            </Button>
            <Button
              variant="ghost"
              className="text-primary p-0"
              onClick={toggleTheme}
            >
              <ArrowUpDown />
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-primary p-0"
            onClick={() => router.push("/timesheet")}
          >
            <Plus />
          </Button>
        </div>
      </div>

      {/* ONLY this area scrolls */}
      <div className="flex-1 overflow-auto">
        {!isLoading && (
          <div className="space-y-3 max-w-[600px] mx-auto p-4">
            {timesheets?.map((timesheet) => (
              <TimesheetCard
                key={timesheet.id}
                date={timesheet.date.toString()}
                project={timesheet.project.name}
                billableHours={timesheet.billableHours}
                nonBillableHours={timesheet.nonBillableHours}
                onClick={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
