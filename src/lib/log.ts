import { appendFile } from "node:fs";
import { pathToFileURL } from "node:url";

export const LOGFILE = pathToFileURL("./log.txt"); //TODO change this to be in the .config folder

export const log = (text: string) => {
  appendFile(LOGFILE, `${text}\n`, (err) => {
    if (err) {
      throw err;
    }
  });
};
