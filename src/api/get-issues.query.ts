import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { env } from "../env.js";
import { log } from "../lib/log.js";
import { request } from "./request.js";

// Helper type to make TypeScript happy with dynamic field access
type DynamicFields = {
  [key: string]: unknown;
};

export const issue = z
  .object({
    id: z.string(),
    key: z.string(),
    fields: z
      .object({
        summary: z.string(),
        description: z
          .object({
            content: z.array(z.unknown()),
          })
          .nullable(),
        reporter: z.object({
          accountId: z.string(),
          displayName: z.string(),
        }),
        assignee: z
          .object({
            accountId: z.string(),
            displayName: z.string(),
          })
          .nullable(),
        priority: z.object({
          id: z.string(),
          name: z.string(),
        }),
        status: z.object({
          id: z.string(),
        }),
        project: z.object({
          id: z.string(),
        }),
      })
      .and(
        z.record(z.string(), z.unknown()), // Allow any additional fields
      ),
  })
  .transform((data) => {
    // Get the story points value from the dynamic field
    const storyPoints = (data.fields as DynamicFields)[env.STORY_POINTS_FIELD];
    let developer: string | null = null;
    if (env.DEVELOPER_FIELD) {
      developer =
        (
          (data.fields as DynamicFields)[env.DEVELOPER_FIELD] as {
            displayName: string | undefined;
          }
        )?.displayName ?? null;
    }

    // Return a new object with all the original data plus the transformed storyPoints field
    return {
      ...data,
      fields: {
        ...data.fields,
        storyPoints: storyPoints != null ? Number(storyPoints) : null,
        developer,
        assignee: {
          displayName: data.fields.assignee?.displayName ?? "Unassigned",
          accountId: data.fields.assignee?.accountId ?? "",
        },
      },
    };
  });

export type Issue = z.infer<typeof issue>;

const issueSchema = z.object({
  issues: z.array(issue),
  nextPageToken: z.string().optional(),
});

const fetchIssues = async (jql: string) => {
  const fields = [
    "id",
    "key",
    "priority",
    "assignee",
    "status",
    "reporter",
    "issuetype",
    "description",
    "summary",
    "project",
    env.STORY_POINTS_FIELD,
    env.DEVELOPER_FIELD,
  ].filter(Boolean);

  let nextPageToken: string | undefined = undefined;
  let allIssues: Issue[] = [];

  do {
    const response = await request(
      `/api/3/search/jql?jql=${env.boards?.[Number(env.JIRA_BOARD_ID)]?.jqlPrefix} ${jql}&fields=${fields.join(",")}&maxResults=200${nextPageToken ? `&nextPageToken=${nextPageToken}` : ""}`,
    );

    try {
      const parsed = issueSchema.parse(response);
      allIssues = allIssues.concat(parsed.issues);
      nextPageToken = parsed.nextPageToken;
    } catch (error) {
      log(`Failed to parse response for issues: ${error}`);
      throw error;
    }
  } while (nextPageToken);
  return allIssues;
};

export const useIssueQuery = (jql: string | undefined) => {
  return useQuery({
    queryKey: ["issues"],
    queryFn: () => fetchIssues(jql!),
    enabled: jql !== undefined,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};
