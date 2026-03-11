import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1).max(3000),
  sessionId: z.string().trim().min(1).max(100).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        text: z.string().trim().min(1).max(1500)
      })
    )
    .max(10)
    .optional()
});
