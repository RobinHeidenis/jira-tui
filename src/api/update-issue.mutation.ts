import { useMutation, useQueryClient } from "@tanstack/react-query";
import { log } from "../lib/log.js";
import type { Issue } from "./get-issues.query.js";
import { request } from "./request.js";

interface UpdateIssueMutationVariables {
  issueId: string;
  fields: Record<string, unknown>;
}

const updateIssue = async (variables: UpdateIssueMutationVariables) => {
  await request(`api/3/issue/${variables.issueId}`, {
    method: "PUT",
    body: JSON.stringify({
      fields: variables.fields,
    }),
  });
};

export const useUpdateIssueMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    unknown,
    Error,
    UpdateIssueMutationVariables,
    { previousIssues: Issue[] }
  >({
    mutationFn: updateIssue,
    onMutate: (variables) => {
      queryClient.cancelQueries({ queryKey: ["issues"] });

      const issues = queryClient.getQueryData(["issues"]) as Issue[];

      queryClient.setQueryData(
        ["issues"],
        issues.map((issue) => {
          if (issue.id === variables.issueId) {
            const updatedFields: Record<string, unknown> = {};

            for (const [key, value] of Object.entries(variables.fields)) {
              if (typeof value === "object" && !Array.isArray(value)) {
                updatedFields[key] = {
                  ...(issue.fields[key as keyof typeof issue.fields] as Record<
                    string,
                    unknown
                  >),
                  ...value,
                };
              } else {
                updatedFields[key] = value;
              }
            }
            return {
              ...issue,
              fields: {
                ...issue.fields,
                ...updatedFields,
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
