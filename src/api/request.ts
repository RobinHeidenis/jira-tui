import { env } from "../env.js";
import { log } from "../lib/log.js";

export const request = async (
  endpoint: string,
  customOptions?: RequestInit,
) => {
  const options: RequestInit = {
    method: "GET",
    headers: {
      Authorization: `Basic ${env.JIRA_API_KEY}`,
      "Content-Type": "application/json",
    },
    ...customOptions,
  };

  const response = await fetch(
    `${env.JIRA_BASE_URL}/rest/${endpoint}`,
    options,
  );

  const responseText = await response.text();
  log(`Response from ${endpoint}: ${response.status}`);

  if (!response.ok) {
    log(
      `Fetching ${endpoint} returned ${response.status}; response: ${responseText}`,
    );
    throw new Error(`Error fetching ${endpoint}: ${await response.text()}`);
  }

  if (responseText === "") {
    return {};
  }

  return await JSON.parse(responseText);
};
