#!/usr/bin/env node
import { unlink } from "node:fs";
import { withFullScreen } from "fullscreen-ink";
import React from "react";
import { App } from "./app.js";
import { LOGFILE } from "./lib/log.js";

unlink(LOGFILE, (error) => {
  if (error) {
    console.error(error);
  }
});
const ink = withFullScreen(<App />);
ink.start();
await ink.waitUntilExit();
