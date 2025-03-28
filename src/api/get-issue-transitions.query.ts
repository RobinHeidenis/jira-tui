import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { HOUR, request } from "./request.js";

const transition = z.object({
  id: z.string(),
  name: z.string(),
  to: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
  }),
});

const fetchIssueTransitions = async (issueId: string) => {
  const response = await request(`api/3/issue/${issueId}/transitions`);

  return z.object({ transitions: z.array(transition) }).parse(response)
    .transitions;
};

export const useGetIssueTransitionsQuery = (
  issueId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["priorities", issueId],
    queryFn: () => fetchIssueTransitions(issueId),
    staleTime: HOUR,
    enabled,
  });
};
