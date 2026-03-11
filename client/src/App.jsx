import { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import RiskBanner from "./components/RiskBanner.jsx";
import ChatShell from "./components/ChatShell.jsx";
import Composer from "./components/Composer.jsx";
import { sendMessage } from "./api/chat.js";

const initialMessages = [
  {
    role: "assistant",
    text:
      "Hi. I’m here to support you with stress, anxiety, exam pressure, burnout, or loneliness. Tell me what feels heavy right now.",
    support: {
      steps: ["Take one slow breath.", "Write your main worry in one line."],
      nextAction: "Share what is troubling you most right now.",
      disclaimer:
        "I can support you with coping suggestions, but I am not a replacement for a licensed mental health professional."
    }
  }
];

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);

  const history = useMemo(
    () =>
      messages.map((m) => ({
        role: m.role,
        text: m.text
      })),
    [messages]
  );

  async function handleSend(text) {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const result = await sendMessage(text, history.slice(-8));
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: result.reply,
          support: result.structuredSupport
        }
      ]);
      setMeta({ risk: result.risk, category: result.category, info: result.meta });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Something went wrong while generating support. Please try again in a moment.",
          support: {
            steps: ["Take one slow breath.", "Try sending your message again."],
            nextAction: "Retry after a moment.",
            disclaimer:
              "I can support you with coping suggestions, but I am not a replacement for a licensed mental health professional."
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <main className="layout">
        <section className="left-panel">
          <Header />

          <div className="info-card">
            <h3>What this assistant can do</h3>
            <ul>
              <li>Support with stress, anxiety, burnout, loneliness, and exam pressure</li>
              <li>Give small practical coping steps</li>
              <li>Suggest escalation when risk appears high</li>
            </ul>
          </div>

          <div className="info-card muted">
            <h3>Important</h3>
            <p>
              This is a support assistant, not a therapist or emergency service.
              If you feel in immediate danger, contact a trusted adult or local emergency support now.
            </p>
          </div>
        </section>

        <section className="chat-panel">
          <RiskBanner risk={meta?.risk} category={meta?.category} />
          <ChatShell messages={messages} />
          <Composer onSend={handleSend} loading={loading} />
        </section>
      </main>
    </div>
  );
}
