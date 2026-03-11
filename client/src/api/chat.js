const API_BASE = "http://localhost:8080/api/v1";

export async function sendMessage(message, history = []) {
  const response = await fetch(`${API_BASE}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message, history, sessionId: "demo-session" })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}
