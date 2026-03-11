import { buildClassifierPrompt } from "../prompts/classifier.prompt.js";
import { buildSupportPrompt } from "../prompts/response.prompt.js";
import { keywordRiskScan, mergeRiskSignals } from "../policies/risk.policy.js";
import { normalizeText } from "../utils/normalize.js";
import { buildFallbackReply } from "../utils/fallbackReplies.js";
import { callPrimaryModel, callFallbackModel } from "./provider.service.js";

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = String(text || "").match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

async function classifyMessage(message) {
  const systemPrompt =
    "You are a strict JSON classifier. Return only valid JSON with no markdown.";
  const userPrompt = buildClassifierPrompt(message);

  try {
    const primary = await callPrimaryModel({ systemPrompt, userPrompt, temperature: 0 });
    const parsed = safeJsonParse(primary);
    if (parsed) return { ...parsed, provider: "openrouter" };
  } catch {}

  try {
    const fallback = await callFallbackModel({ systemPrompt, userPrompt, temperature: 0 });
    const parsed = safeJsonParse(fallback);
    if (parsed) return { ...parsed, provider: "huggingface" };
  } catch {}

  return {
    category: "general_support",
    severity: "moderate",
    confidence: 0.4,
    signals: ["classification_fallback"],
    language: "Hinglish",
    requiresEscalation: false,
    provider: "fallback"
  };
}

async function generateSupportResponse(message, risk) {
  const systemPrompt =
    "You are a safe student support assistant. Return only valid JSON. Never act as a therapist.";
  const userPrompt = buildSupportPrompt({ message, risk });

  try {
    const primary = await callPrimaryModel({ systemPrompt, userPrompt, temperature: 0.3 });
    const parsed = safeJsonParse(primary);
    if (parsed?.reply) {
      return { ...parsed, provider: "openrouter" };
    }
  } catch {}

  try {
    const fallback = await callFallbackModel({ systemPrompt, userPrompt, temperature: 0.3 });
    const parsed = safeJsonParse(fallback);
    if (parsed?.reply) {
      return { ...parsed, provider: "huggingface" };
    }
  } catch {}

  return {
    ...buildFallbackReply({
      category: risk.category,
      severity: risk.severity,
      language: risk.language || "Hinglish"
    }),
    provider: "template"
  };
}

function enforceFinalPolicy(result, risk) {
  const disclaimer =
    "I can support you with coping suggestions, but I am not a replacement for a licensed mental health professional.";

  if (!result?.structuredSupport) {
    result.structuredSupport = { steps: [], nextAction: "Take one small safe step.", disclaimer };
  }

  result.structuredSupport.disclaimer = disclaimer;

  if (risk.severity === "critical") {
    result.reply =
      "I’m really glad you reached out. Your safety matters right now. Please contact a trusted adult, counselor, guardian, or local emergency support immediately, and try not to stay alone.";
    result.structuredSupport.steps = [
      "Move near a trusted person now.",
      "Put away anything that could harm you.",
      "Call a trusted adult or emergency support now."
    ];
    result.structuredSupport.nextAction = "Reach a trusted person immediately.";
  }

  return result;
}

export async function handleChatMessage(input) {
  const message = normalizeText(input.message);

  const ruleSignal = keywordRiskScan(message);
  const modelSignal = await classifyMessage(message);
  const risk = mergeRiskSignals(ruleSignal, modelSignal);

  const response = await generateSupportResponse(message, risk);
  const safeResponse = enforceFinalPolicy(response, risk);

  return {
    reply: safeResponse.reply,
    risk: risk.severity,
    category: risk.category,
    meta: {
      confidence: risk.confidence,
      language: risk.language || "Hinglish",
      requiresEscalation: Boolean(risk.requiresEscalation),
      usedProvider: safeResponse.provider,
      classifierProvider: modelSignal.provider || "unknown",
      signals: risk.signals || []
    },
    structuredSupport: safeResponse.structuredSupport
  };
}
