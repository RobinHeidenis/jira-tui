import { Box, Text } from "ink";
import type { z } from "zod";
import type { issue } from "./api/get-issues.query.js";
import { Issue } from "./issue.js";

export const Column = ({
  name,
  issues,
  top,
  hideIssues,
  distanceOffScreen,
  shouldGrow,
  selectedIndex,
}: {
  name: string;
  issues: z.infer<typeof issue>[];
  top: number;
  hideIssues?: boolean;
  distanceOffScreen: number;
  shouldGrow?: boolean;
  selectedIndex?: number;
}) => {
  return (
    <Box
      borderStyle={"round"}
      borderColor={selectedIndex !== undefined ? "green" : "white"}
      flexGrow={shouldGrow ? 1 : 0}
      flexBasis={0}
      minWidth={35}
      flexShrink={0}
      flexDirection="column"
    >
      <Box justifyContent="space-between" flexShrink={0}>
        <Text> {name}</Text>
        <Text>{issues.length} </Text>
      </Box>
      <Box height={"100%"} overflow="hidden">
        <Box flexDirection="column" marginTop={-top}>
          {hideIssues ? (
            distanceOffScreen > 0 && distanceOffScreen < 23 ? (
              <Box flexDirection="column">
                <Text> </Text>
                <Text>
                  {issues.length} issue{issues.length === 1 ? "" : "s"}
                </Text>
                {distanceOffScreen < 14 ? (
                  <Text>Scroll for details</Text>
                ) : (
                  <Box flexDirection="column">
                    <Text>Scroll for</Text>
                    <Text>details</Text>
                  </Box>
                )}
              </Box>
            ) : (
              <></>
            )
          ) : (
            issues.map((issue, index) => (
              <Issue
                key={issue.id}
                name={issue.fields.summary}
                issueNumber={issue.key}
                storyPoints={issue.fields.storyPoints}
                assigneeName={issue.fields.assignee.displayName}
                priority={issue.fields.priority.name}
                selected={
                  selectedIndex !== undefined && selectedIndex === index
                }
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};
