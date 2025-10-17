import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { timesheetSchema } from "@/schemas/timesheet-schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import timesheetService from "@/services/timesheet";
import { Textarea } from "@/components/ui/textarea";
import { ITimesheet } from "@/interfaces/timesheet";

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
    <div className="h-screen w-screen bg-gray-500 flex justify-center">
      <div className="bg-black w-[40%]">
        <div className="flex items-center justify-between bg-[#F4C542] px-4 py-4">
          <Button variant={"ghost"} className="text-xl">
            <X className="h-8 w-8" />
          </Button>
          <h1 className="text-xl font-semibold">Add / Edit Timesheet</h1>
          <Button
            variant={"ghost"}
            className="text-xl"
            onClick={form.handleSubmit(onSubmit)}
          >
            <Check className="h-8 w-8" />
          </Button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 p-4"
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="project"
              render={({ field }) => {
                const selected = projects?.find((p) => p.id === field.value);
                return (
                  <FormItem>
                    <FormLabel>Project</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full !text-left">
                          {selected?.name ?? "Select the Project"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {projects?.map((p) => (
                          <DropdownMenuItem
                            key={p.id}
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

            <FormField
              control={form.control}
              name="billableHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billable Hours</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nonBillableHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Non-Billable Hours</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Description</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
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
