import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { timesheetSchema } from "@/schemas/timesheet-schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/shadcn/button";
import { CalendarDays, Check, ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/shadcn/dropdown-menu";
import projectService from "@/services/project";
import { useState } from "react";
import { IProject } from "@/interfaces/project";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import timesheetService from "@/services/timesheet";
import { Textarea } from "@/components/shadcn/textarea";
import { ITimesheet } from "@/interfaces/timesheet";
import { useRouter } from "next/router";

export default function Timesheet() {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const router = useRouter();

  const { data: projects, isLoading } = useQuery({
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
      form.reset();
      router.push("/");
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to submit timesheet");
    },
  });

  const onSubmit = (values: TimesheetSubmit) => {
    mutation.mutate({
      ...values,
      project: selectedProject ?? { id: -1, name: "Nothing" },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="w-full max-w-md bg-background rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary text-primary text-lg font-semibold px-4 py-2 rounded-t-lg">
          <Button
            variant="ghost"
            className="text-primary hover:bg-secondary-foreground p-0"
            onClick={() => router.push("/")}
          >
            <X className="h-6 w-6" />
          </Button>
          <span>Add / Edit Timesheet</span>
          <Button
            variant="ghost"
            className="text-primary hover:bg-secondary-foreground p-0"
            onClick={form.handleSubmit(onSubmit)}
          >
            <Check className="h-6 w-6" />
          </Button>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-4 py-6 space-y-4"
          >
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
                        value={field.value ? String(field.value) : ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-[40%] p-2 border border-muted bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary hover:border-secondary"
                      />
                    </FormControl>
                    <div className="bg-secondary p-2 ml-2 cursor-pointer hover:bg-yellow-600 rounded">
                      <CalendarDays className="text-primary" size={20} />
                    </div>{" "}
                    {/*TODO: Combine these*/}
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
                const selected = projects?.find((p) => p.id === field.value);
                return (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Project Name<span className="text-destructive">*</span>
                    </FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between border border-muted bg-background text-foreground hover:border-secondary focus:ring-2 focus:ring-secondary"
                        >
                          <span>
                            {isLoading
                              ? "Loading..."
                              : (selected?.name ?? "Please Select a Project")}
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
                  <FormLabel className="text-foreground">
                    Billable Hours
                  </FormLabel>
                  <FormControl>
                    <Input
                      inputMode="decimal"
                      min={0}
                      max={4}
                      {...field}
                      value={field.value ? Number(field.value) : 0}
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
                  <FormLabel className="text-foreground">
                    Non-Billable Hours
                  </FormLabel>
                  <FormControl>
                    <Input
                      inputMode="numeric"
                      min={0}
                      max={4}
                      {...field}
                      value={field.value ? Number(field.value) : 0}
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
  );
}
