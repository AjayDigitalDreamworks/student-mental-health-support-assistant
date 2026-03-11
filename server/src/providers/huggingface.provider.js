import { env } from "../config/env.js";
import { httpJson } from "../utils/http.js";

const HF_URL = "https://router.huggingface.co/v1/chat/completions";

export async function huggingFaceChat({ systemPrompt, userPrompt, temperature = 0.2 }) {
  if (!env.huggingFaceApiKey) {
    throw new Error("HUGGINGFACE_API_KEY missing");
  }

  const data = await httpJson(HF_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.huggingFaceApiKey}`
    },
    body: JSON.stringify({
      model: env.huggingFaceModel,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  return data?.choices?.[0]?.message?.content || "";
}
