import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI || "",
  openRouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openRouterModel: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
  openRouterAppName: process.env.OPENROUTER_APP_NAME || "Student Support Portal",
  openRouterAppUrl: process.env.OPENROUTER_APP_URL || "http://localhost:5173",
  huggingFaceApiKey: process.env.HUGGINGFACE_API_KEY || "",
  huggingFaceModel:
    process.env.HUGGINGFACE_MODEL || "meta-llama/Llama-3.1-8B-Instruct",
  enableDb: String(process.env.ENABLE_DB || "false") === "true"
};
