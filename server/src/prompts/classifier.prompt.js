export function buildClassifierPrompt(message) {
  return `You are a mental health support risk classifier for a student support portal.
Return ONLY valid JSON.

Classify the user message.

Allowed category values:
anxiety, exam_stress, social_isolation, burnout, self_harm_risk, urgent_crisis, general_support

Allowed severity values:
low, moderate, high, critical

Return JSON shape:
{
  "category": "...",
  "severity": "...",
  "confidence": 0.0,
  "signals": ["..."],
  "language": "Hindi|English|Hinglish",
  "requiresEscalation": true
}

Rules:
- Self-harm, suicide, immediate danger => critical or high
- Panic, collapse, hopeless crisis wording => high
- Exams, stress, overload => low or moderate unless dangerous
- Return only JSON and no markdown

User message:
${JSON.stringify(message)}`;
}
