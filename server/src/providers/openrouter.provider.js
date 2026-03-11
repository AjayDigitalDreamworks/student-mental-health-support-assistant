import { env } from "../config/env.js";
import { httpJson } from "../utils/http.js";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function openRouterChat({ systemPrompt, userPrompt, temperature = 0.2 }) {
  if (!env.openRouterApiKey) {
    throw new Error("OPENROUTER_API_KEY missing");
  }

  const data = await httpJson(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
      "HTTP-Referer": env.openRouterAppUrl,
      "X-Title": env.openRouterAppName
    },
    body: JSON.stringify({
      model: env.openRouterModel,
      temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  return data?.choices?.[0]?.message?.content || "";
}
