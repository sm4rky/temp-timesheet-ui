import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/shadcn/card";

interface TimesheetCardProps {
  date: string;
  project: string;
  billableHours: number;
  nonBillableHours: number;
  onClick?: () => void;
}

export default function TimesheetCard({
  date,
  project,
  billableHours,
  nonBillableHours,
  onClick,
}: TimesheetCardProps) {
  return (
    <Card
      onClick={onClick}
      className="!bg-background rounded-lg shadow-lg p-4 flex justify-between items-center cursor-pointer hover:bg-secondary/60 hover:text-primary"
    >
      <CardContent className="p-0 flex justify-between items-center w-full">
        <div className="space-y-1">
          <div className="text-foreground font-medium">Date: {date}</div>
          <div className="text-foreground">Project: {project}</div>
          <div className="flex gap-4 text-foreground">
            <span>Billable Hours: {billableHours}</span>
            <span>NonBillable Hours: {nonBillableHours}</span>
          </div>
        </div>
        <ChevronRight className="text-secondary h-5 w-5" />
      </CardContent>
    </Card>
  );
}
