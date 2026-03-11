import express from "express";
import morgan from "morgan";
import chatRoutes from "./routes/chat.routes.js";
import { securityStack } from "./middleware/security.middleware.js";
import { requestIdMiddleware } from "./middleware/requestId.middleware.js";
import { errorMiddleware, notFoundMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(securityStack);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(requestIdMiddleware);

app.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok", service: "student-support-backend" });
});

app.use("/api/v1/chat", chatRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
