import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { request } from "./request.js";

const priority = z.object({
  statusColor: z.string(),
  description: z.string(),
  name: z.string(),
  id: z.string(),
});

const fetchPriorities = async (projectId: string) => {
  const response = await request(
    `api/3/priority/search?projectId=${projectId}`,
  );

  return z.object({ values: z.array(priority) }).parse(response).values;
};

export const useGetPrioritiesQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["priorities"],
    queryFn: () => fetchPriorities(projectId),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 60,
  });
};
