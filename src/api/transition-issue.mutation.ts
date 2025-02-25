import { useMutation, useQueryClient } from "@tanstack/react-query";
import { log } from "../lib/log.js";
import type { Issue } from "./get-issues.query.js";
import { request } from "./request.js";

interface TransitionIssueMutationVariables {
  issueId: string;
  transitionId: string;
  newStatusId: string;
}

const transitionIssue = async (variables: TransitionIssueMutationVariables) => {
  await request(`api/3/issue/${variables.issueId}/transitions`, {
    method: "POST",
    body: JSON.stringify({
      transition: {
        id: variables.transitionId,
      },
    }),
  });
};

export const useTransitionIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    TransitionIssueMutationVariables,
    { previousIssues: Issue[] }
  >({
    mutationFn: transitionIssue,
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ["issues"] });

      const issues = queryClient.getQueryData(["issues"]) as Issue[];

      queryClient.setQueryData(
        ["issues"],
        issues.map((issue) => {
          if (issue.id === variables.issueId) {
            return {
              ...issue,
              fields: {
                ...issue.fields,
                status: {
                  id: variables.newStatusId,
                },
              },
            };
          }

          return issue;
        }),
      );

      return { previousIssues: issues };
    },
    onError: (error, _variables, context) => {
      log(`Error updating issue: ${error.message} ${error.stack}`);
      queryClient.setQueryData(["issues"], context?.previousIssues ?? []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
};
