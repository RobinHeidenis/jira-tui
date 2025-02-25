import { Box, Text } from "ink";

export const priorityMap: Record<string, Parameters<typeof Text>[0]["color"]> =
  {
    Blocker: "redBright",
    High: "red",
    Medium: "yellow",
    Low: "blueBright",
  };

export const Issue = ({
  name,
  issueNumber,
  storyPoints,
  assigneeName,
  priority,
  selected,
}: {
  name: string;
  issueNumber: string;
  storyPoints: number | null;
  assigneeName: string;
  priority: string;
  selected?: boolean;
}) => {
  return (
    <Box
      borderStyle={selected ? "bold" : "round"}
      borderColor={selected ? "greenBright" : "white"}
      width={"100%"}
      minWidth={33}
      flexDirection="column"
      paddingX={1}
      flexShrink={0}
    >
      <Text>{name}</Text>
      <Box justifyContent="space-between" marginTop={1}>
        <Box flexDirection="column">
          <Text>
            {"\uf292"} {issueNumber}
          </Text>
          <Text>
            {"\uf43a"} {storyPoints !== null ? storyPoints : "N/A"}
          </Text>
        </Box>
        <Box flexDirection="column" alignItems="flex-start">
          <Text>
            {"\uf007"} {assigneeName.split(" ")[0]}
          </Text>
          <Text color={priorityMap[priority] ?? "yellow"}>
            {"\uf161"} {priority}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
