import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/router";

import * as z from "zod";
import {
  timesheetSchema,
  TimesheetFormValues,
  TimesheetSubmit,
} from "@/schemas/timesheet-schema";

import { Button } from "@/components/shadcn/button";
import { CalendarDays, Check, ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/shadcn/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Textarea } from "@/components/shadcn/textarea";

import projectService from "@/services/project";
import timesheetService from "@/services/timesheet";

import { IProject } from "@/interfaces/project";
import { ITimesheetRequest } from "@/interfaces/timesheet";

function todayYMD(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function Timesheet() {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const router = useRouter();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAllProjects,
    staleTime: 5 * 60 * 1000,
  });

  const form = useForm<TimesheetFormValues>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      date: todayYMD(), // yyyy-mm-dd string
      project: -1,
      billableHours: 0,
      nonBillableHours: 0,
      taskDescription: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (payload: ITimesheetRequest) => timesheetService.createTimesheet(payload),
    onSuccess: () => {
      form.reset({
        date: todayYMD(),
        project: -1,
        billableHours: 0,
        nonBillableHours: 0,
        taskDescription: "",
      });
      router.push("/Home");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to submit timesheet");
    },
  });

  const onSubmit = (values: TimesheetSubmit) => {
    const projectId = selectedProject?.id ?? values.project ?? -1;
    const payload: ITimesheetRequest = {
      projectId: Number(projectId),
      date: values.date,
      billableHours: values.billableHours,       // already number via z.coerce
      nonBillableHours: values.nonBillableHours, // already number via z.coerce
      taskDescription: values.taskDescription.trim(),
    };
    mutation.mutate(payload);
  };

  return (
    /* Fill the frame; header fixed; only form area scrolls. */
    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header (fixed) */}
      <div className="shrink-0 flex items-center justify-between bg-secondary text-primary text-lg font-semibold px-4 py-2">
        <Button
          variant="ghost"
          className="text-primary hover:bg-secondary-foreground p-0"
          onClick={() => router.push("/Home")}
          aria-label="Close"
          title="Close"
        >
          <X className="h-6 w-6" />
        </Button>
        <span className="select-none">Add / Edit Timesheet</span>
        <Button
          variant="ghost"
          className="text-primary hover:bg-secondary-foreground p-0"
          onClick={form.handleSubmit(onSubmit)}
          aria-label="Save"
          title="Save"
        >
          <Check className="h-6 w-6" />
        </Button>
      </div>

      {/* Body (scrolls) */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Date */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Date</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="w-[40%] p-2 border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary hover:border-secondary"
                        />
                      </FormControl>
                      <div className="bg-secondary p-2 ml-2 rounded cursor-default select-none">
                        <CalendarDays className="text-primary" size={20} />
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Project */}
              <FormField
                control={form.control}
                name="project"
                render={({ field }) => {
                  const selected =
                    selectedProject ?? projects?.find((p) => p.id === field.value) ?? null;
                  return (
                    <FormItem>
                      <FormLabel className="text-foreground">
                        Project Name<span className="text-destructive">*</span>
                      </FormLabel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between border border-muted bg-background text-foreground hover:border-secondary focus:ring-2 focus:ring-secondary"
                          >
                            <span>
                              {isLoading
                                ? "Loading..."
                                : selected?.name ?? "Please Select a Project"}
                            </span>
                            <ChevronDown className="text-secondary ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full bg-background text-foreground border border-muted">
                          {projects?.map((p) => (
                            <DropdownMenuItem
                              key={p.id}
                              className="hover:bg-secondary hover:text-primary"
                              onClick={() => {
                                field.onChange(p.id);
                                setSelectedProject(p);
                              }}
                            >
                              {p.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Billable Hours */}
              <FormField
                control={form.control}
                name="billableHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Billable Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.25"
                        min={0}
                        max={4}
                        value={field.value ?? 0}
                        onChange={(e) => {
                          const v = e.target.value;
                          // keep it numeric for RHF; coerce '' to 0 to avoid string state
                          field.onChange(v === "" ? 0 : Number(v));
                        }}
                        className="w-full p-2 border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary hover:border-secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Non-Billable Hours */}
              <FormField
                control={form.control}
                name="nonBillableHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Non-Billable Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.25"
                        min={0}
                        max={4}
                        value={field.value ?? 0}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? 0 : Number(v));
                        }}
                        className="w-full p-2 border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary hover:border-secondary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Task Description */}
              <FormField
                control={form.control}
                name="taskDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Task Description<span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                        className="w-full h-24 p-2 border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary hover:border-secondary"
                        placeholder="Please Enter Task Details"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
