import { Router } from "express";
import { postChatMessage } from "../controllers/chat.controller.js";
import { chatRateLimit } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/message", chatRateLimit, postChatMessage);

export default router;
