import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { env } from "../env.js";
import { makeLogger } from "../lib/logger.js";
import { request } from "./request.js";

const logger = makeLogger("GetBoard");

const boardSchema = z.object({
  columnConfig: z.object({
    columns: z.array(
      z.object({
        name: z.string(),
        statuses: z.array(z.object({ id: z.string() })),
      }),
    ),
  }),
  filter: z.object({
    id: z.string(),
  }),
});

const filter = z.object({
  jql: z.string(),
});

export const boardWithFilter = boardSchema.extend({
  filter,
});

const fetchBoard = async () => {
  const boardResponse = await request(
    `agile/1.0/board/${env.JIRA_BOARD_ID}/configuration`,
  );
  const board = boardSchema.parse(boardResponse);

  const filterResponse = await request(`api/3/filter/${board.filter.id}`);

  try {
    return {
      ...board,
      filter: filter.parse(filterResponse),
    };
  } catch (error) {
    logger.error("Failed to parse response for board", error);
    throw error;
  }
};

export type FetchBoardResult = ReturnType<typeof fetchBoard>;

export const useBoardQuery = () => {
  return useQuery({
    queryKey: ["board"],
    queryFn: fetchBoard,
    refetchOnReconnect: false,
    refetchInterval: false,
  });
};
