import { openRouterChat } from "../providers/openrouter.provider.js";
import { huggingFaceChat } from "../providers/huggingface.provider.js";

export async function callPrimaryModel(payload) {
  return openRouterChat(payload);
}

export async function callFallbackModel(payload) {
  return huggingFaceChat(payload);
}
