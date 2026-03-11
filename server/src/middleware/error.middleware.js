import { ZodError } from "zod";
import { logger } from "../config/logger.js";

export function notFoundMiddleware(req, res) {
  res.status(404).json({ error: "Route not found" });
}

export function errorMiddleware(err, req, res, next) {
  logger.error({ err, requestId: req.requestId }, "Unhandled server error");

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Invalid request body",
      details: err.flatten(),
      requestId: req.requestId
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    requestId: req.requestId
  });
}
