import { useRouter } from "next/router";
import { Button } from "@/components/shadcn/button";
import { Calendar, Repeat, ArrowUpDown, Plus, TreePalm } from "lucide-react";
import TimesheetCard from "@/components/Home/timesheet-card";
import timesheetService from "@/services/timesheet";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "@/providers/ThemeProvider";

export default function HomePage() {
  const router = useRouter();

  const { toggleTheme} = useTheme();

  const { data: timesheets, isLoading } = useQuery({
    queryKey: ["find-all-timesheets"],
    queryFn: timesheetService.getAllTimesheets
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-lg p-4 space-y-4">
        {/* Top navbar */}
        <div className="flex items-center justify-between bg-secondary text-primary px-4 py-2 rounded-md">
          <div className="flex gap-3">
            <Button variant="ghost" className="text-primary p-0" onClick={() => router.push("/Timeoff")}>
              <TreePalm />
            </Button>
            <Button variant="ghost" className="text-primary p-0" onClick={() => router.push("/Holiday")}>
              <Calendar />
            </Button>
            <Button variant="ghost" className="text-primary p-0">
              <Repeat />
            </Button>
            <Button variant="ghost" className="text-primary p-0" onClick={toggleTheme}>
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

        {/* Index cards */}
        {!isLoading && (
          <div className="space-y-3">
            {timesheets?.map((timesheet) => (
              <TimesheetCard
                key={timesheet.id}
                date={timesheet.date.toString()}
                project={timesheet.project.name}
                billableHours={timesheet.billableHours}
                nonBillableHours={timesheet.nonBillableHours}
                onClick={() => {
                  // placeholder for detail page
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}