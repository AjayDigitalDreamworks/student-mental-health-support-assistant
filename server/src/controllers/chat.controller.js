import { chatMessageSchema } from "../validators/chat.validator.js";
import { handleChatMessage } from "../services/chat.service.js";

export async function postChatMessage(req, res, next) {
  try {
    const parsed = chatMessageSchema.parse(req.body);
    const result = await handleChatMessage(parsed);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
