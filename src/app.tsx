import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, Text } from "ink";
import React from "react";
import { BoardView } from "./board-view.js";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Box flexDirection="column">
        <Text> JIRA TIME</Text>
        <Box
          height={"100%"}
          width={"100%"}
          borderStyle={"round"}
          flexDirection="column"
        >
          <BoardView />
        </Box>
      </Box>
    </QueryClientProvider>
  );
};
