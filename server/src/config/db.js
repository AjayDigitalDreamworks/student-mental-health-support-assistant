import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export async function connectDb() {
  if (!env.enableDb || !env.mongoUri) {
    logger.info("Database disabled. Running without MongoDB.");
    return;
  }

  await mongoose.connect(env.mongoUri);
  logger.info("MongoDB connected");
}
