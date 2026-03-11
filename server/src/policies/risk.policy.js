const CRITICAL_PATTERNS = [
  /suicide/i,
  /kill myself/i,
  /end my life/i,
  /mar jana/i,
  /jaan dena/i,
  /sab chhod dena/i,
  /self harm/i,
  /khud ko nuksan/i
];

const HIGH_PATTERNS = [
  /panic attack/i,
  /can.t breathe/i,
  /hopeless/i,
  /nobody cares/i,
  /i want to disappear/i,
  /jeene ka mann nahi/i,
  /bahut zyada ghabrahat/i
];

export function keywordRiskScan(text) {
  const normalized = String(text || "");

  if (CRITICAL_PATTERNS.some((re) => re.test(normalized))) {
    return {
      category: "urgent_crisis",
      severity: "critical",
      confidence: 0.98,
      signals: ["critical_keyword_match"],
      requiresEscalation: true,
      language: "Hinglish"
    };
  }

  if (HIGH_PATTERNS.some((re) => re.test(normalized))) {
    return {
      category: "self_harm_risk",
      severity: "high",
      confidence: 0.85,
      signals: ["high_keyword_match"],
      requiresEscalation: true,
      language: "Hinglish"
    };
  }

  return null;
}

export function mergeRiskSignals(ruleSignal, modelSignal) {
  if (!ruleSignal && !modelSignal) {
    return {
      category: "general_support",
      severity: "low",
      confidence: 0.5,
      signals: ["default"],
      requiresEscalation: false,
      language: "Hinglish"
    };
  }

  if (!ruleSignal) return modelSignal;
  if (!modelSignal) return ruleSignal;

  const order = { low: 1, moderate: 2, high: 3, critical: 4 };
  const picked = order[ruleSignal.severity] >= order[modelSignal.severity] ? ruleSignal : modelSignal;

  return {
    ...modelSignal,
    ...picked,
    confidence: Math.max(ruleSignal.confidence || 0, modelSignal.confidence || 0),
    signals: [...new Set([...(ruleSignal.signals || []), ...(modelSignal.signals || [])])],
    requiresEscalation:
      Boolean(ruleSignal.requiresEscalation) || Boolean(modelSignal.requiresEscalation),
    language: modelSignal.language || ruleSignal.language || "Hinglish"
  };
}
