export function buildFallbackReply({ category, severity, language = "Hinglish" }) {
  const disclaimer =
    "I can support you with coping suggestions, but I am not a replacement for a licensed mental health professional.";

  if (severity === "critical") {
    return {
      reply:
        language === "Hindi" || language === "Hinglish"
          ? "Mujhe lag raha hai ki aap abhi immediate support deserve karte hain. Kripya abhi kisi trusted adult, guardian, counselor, ya local emergency support se turant contact karein. Akele mat rahiye."
          : "It sounds like you may need immediate support right now. Please contact a trusted adult, counselor, guardian, or local emergency support now. Try not to stay alone.",
      structuredSupport: {
        steps: [
          "Move near a trusted person right now.",
          "Put away anything that could harm you.",
          "Call a trusted adult or local emergency support immediately."
        ],
        nextAction: "Reach out to a trusted person right now.",
        disclaimer
      }
    };
  }

  const map = {
    anxiety: {
      steps: ["Try 4-4-6 breathing for 3 rounds.", "Name 3 things you can see around you."],
      nextAction: "Take one small pause and then do your next tiny task."
    },
    exam_stress: {
      steps: ["Break study into a 20-minute chunk.", "Pick only one topic for the next session."],
      nextAction: "Start with the easiest topic for 20 minutes."
    },
    burnout: {
      steps: ["Drink water and step away for 10 minutes.", "Reduce today’s goal to the top 2 tasks only."],
      nextAction: "Choose only two must-do tasks for today."
    },
    social_isolation: {
      steps: ["Send one simple message to a trusted person.", "Sit in a shared space instead of staying alone."],
      nextAction: "Message one person you feel safest with."
    },
    general_support: {
      steps: ["Pause and take 3 slow breaths.", "Write your biggest worry in one sentence."],
      nextAction: "Tell me the biggest thing weighing on you right now."
    }
  };

  const picked = map[category] || map.general_support;

  return {
    reply:
      language === "Hindi" || language === "Hinglish"
        ? "Main aapki baat samajh raha hoon. Aapko abhi sab kuch ek saath solve nahi karna hai — chhote steps se start karte hain."
        : "I hear you. You do not need to solve everything at once right now — let’s start with very small steps.",
    structuredSupport: {
      steps: picked.steps,
      nextAction: picked.nextAction,
      disclaimer
    }
  };
}
