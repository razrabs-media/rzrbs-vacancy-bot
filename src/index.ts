import dotenv from "dotenv";
import mongoose from "mongoose";
import { logger } from "./services";

dotenv.config();

if (!process.env.BOT_TOKEN) {
  throw Error("Failed to start, BOT_TOKEN is missing");
}

if (!process.env.DB_URL) {
  throw Error("Failed to start, DB_URL is missing");
}

mongoose
  .connect(process.env.DB_URL)
  .then(() => logger.info("Connected to DB"))
  .catch((err) => {
    logger.error("Failed to connect to DB", err);
    throw Error(`Failed to connect to DB - ${err}`);
  });

import "./startBot";
