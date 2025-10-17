import { IProject } from "@/interfaces/project";
import http from "@/services/api";

const PREFIX_PATH = "/api/projects";

const projectService = {
  getAllProjects: async (): Promise<IProject[]> => {
    const response = (await http.get<IProject[]>(`${PREFIX_PATH}`)).data;
    return response;
  },

  createProject: async (data: IProject): Promise<IProject> => {
    const response = (await http.post<IProject>(`${PREFIX_PATH}`)).data;
    return response;
  },
};

export default projectService;
