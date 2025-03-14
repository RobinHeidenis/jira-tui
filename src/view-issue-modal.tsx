import { Box, Text, useInput } from "ink";
import React from "react";
import type { z } from "zod";
import type { issue as issueSchema } from "./api/issue-query.js";
import { env } from "./env.js";
import { priorityMap } from "./issue.js";
import { ADFRenderer } from "./lib/adf-renderer.js";
import type { TopLevelNode } from "./lib/nodes.js";
import { openIssueInBrowser } from "./lib/utils/openIssueInBrowser.js";
import { PaddedText } from "./padded-text.js";
import { useStdoutDimensions } from "./useStdoutDimensions.js";

export const ViewIssueModal = ({
  issue,
  onClose,
}: { issue: z.infer<typeof issueSchema>; onClose: () => void }) => {
  const [columns, rows] = useStdoutDimensions();
  const [topOffset, setTopOffset] = React.useState(0);

  const description = new ADFRenderer(119, 33).render(
    issue.fields.description?.content?.length
      ? (issue.fields.description.content as TopLevelNode[])
      : [
          {
            type: "paragraph",
            content: [{ type: "text", text: "No description." }],
          },
        ],
  );

  const lines = description.length;
  const paddedText = description.map((line) => `${line} `).join("\n");

  useInput((input, key) => {
    if (input === "o") {
      openIssueInBrowser(issue.key);
      return;
    }

    if (lines > 35) {
      if (input === "j") {
        setTopOffset((prev) => Math.min(prev + 3, lines - 33));
      }
      if (input === "k") {
        setTopOffset((prev) => Math.max(prev - 3, 0));
      }
    }

    if (input === "q" || key.escape) {
      onClose();
    }
  });

  // title/description + outer borders + assignees + assignee borders
  const width = 122 + 2 + 20 + 2;

  return (
    <Box
      flexDirection="column"
      position="absolute"
      borderStyle={"round"}
      borderColor={"greenBright"}
      height={41}
      marginLeft={(columns - width) / 2}
      marginTop={(rows - 50) / 2}
    >
      <Box flexDirection="row">
        <Box flexDirection="column">
          <Box
            borderStyle={"round"}
            borderColor={"green"}
            width={122}
            height={3}
          >
            <Text>{issue.fields.summary.padEnd(120, " ")}</Text>
          </Box>
          <Box
            borderStyle={"round"}
            borderColor={"green"}
            width={122}
            height={35}
            overflowY="hidden"
          >
            <Box flexDirection="column" marginTop={-topOffset}>
              <Text>{paddedText}</Text>
            </Box>
          </Box>
        </Box>
        <Box
          borderStyle={"round"}
          borderColor={"green"}
          width={22}
          height={38}
          flexDirection="column"
        >
          <PaddedText text={`\uf292  ${issue.key}`} />
          <PaddedText
            text={`\uf43a  ${issue.fields.storyPoints !== null ? issue.fields.storyPoints : "N/A"}`}
          />
          <PaddedText
            text={`\uf161  ${issue.fields.priority.name}`}
            textProps={{
              color: priorityMap[issue.fields.priority.name] ?? "yellow",
            }}
          />
          <PaddedText text={`\uf007  ${issue.fields.assignee.displayName}`} />
          {env.DEVELOPER_FIELD && (
            <PaddedText text={`\uf121  ${issue.fields.developer}`} />
          )}
          <PaddedText text={`\uf50a  ${issue.fields.reporter.displayName}`} />
          {Array.from({ length: 40 + (env.DEVELOPER_FIELD ? 0 : 1) - 10 }).map(
            (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: We're not actually showing any content, just spaces to override the underlying content
              <PaddedText key={i} text={""} />
            ),
          )}
        </Box>
      </Box>
      <PaddedText text=" Open issue in browser: o | Close: q" maxLength={144} />
      {lines > 35 && (
        <Box
          position="absolute"
          borderStyle={"bold"}
          borderColor={"greenBright"}
          width={1}
          marginLeft={width - 26}
          borderTop={false}
          borderRight={false}
          borderBottom={false}
          marginTop={4 + (topOffset * 16) / (lines - 33)}
          height={17}
        />
      )}
    </Box>
  );
};
