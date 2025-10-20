import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { timesheetSchema } from "@/schemas/timesheet-schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import projectService from "@/services/project";
import { ReactElement, useState } from "react";
import { IProject } from "@/interfaces/project";
import timesheetService from "@/services/timesheet";
import { ITimesheet } from "@/interfaces/timesheet";
import MainLayout from "@/layouts/MainLayout";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAllProjects,
    staleTime: 5 * 60 * 1000,
  });

  type TimesheetFormValues = z.input<typeof timesheetSchema>;
  type TimesheetSubmit = z.output<typeof timesheetSchema>;

  const form = useForm<TimesheetFormValues>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      project: -1,
      billableHours: 0,
      nonBillableHours: 0,
      taskDescription: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ITimesheet) => timesheetService.createTimesheet(data),
    onSuccess: () => {
      alert("Timesheet submitted successfully!");
      form.reset();
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to submit timesheet");
    },
  });

  const onSubmit = (values: TimesheetSubmit) => {
    const request: ITimesheet = {
      date: values.date,
      project: selectedProject ?? { id: -1, name: "Nothing" },
      billableHours: values.billableHours,
      nonBillableHours: values.nonBillableHours,
      taskDescription: values.taskDescription,
    };
    mutation.mutate(request);
  };

  return (
    <div className="h-full w-full flex justify-center items-center">
      Hello
    </div>
  );
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};