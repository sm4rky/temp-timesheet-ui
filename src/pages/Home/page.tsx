import { useQuery } from "@tanstack/react-query";
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

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: projectService.getAllProjects,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="h-screen w-screen bg-gray-500 flex justify-center">
      <div className="bg-white w-[40%]">
        <div className="flex items-center justify-between bg-[#F4C542] px-4 py-4">
          <Button variant={"ghost"} className="text-xl">
            <X className="h-8 w-8" />
          </Button>
          <h1 className="text-xl font-semibold">Add / Edit Timesheet</h1>
          <Button variant={"ghost"} className="text-xl">
            <Check className="h-8 w-8" />
          </Button>
        </div>

        {/* Project Selector */}
        <div className="p-4">
          {isLoading && <p>Loading projects...</p>}
          {error && <p className="text-red-500">Failed to load projects</p>}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full">
                {selectedProject?.name ?? "Select the Project"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full">
              {projects?.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                >
                  {project.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
