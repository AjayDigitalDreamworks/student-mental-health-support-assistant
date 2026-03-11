import MessageBubble from "./MessageBubble.jsx";

export default function ChatShell({ messages }) {
  return (
    <div className="chat-shell">
      {messages.map((item, index) => (
        <MessageBubble
          key={`${item.role}-${index}`}
          role={item.role}
          text={item.text}
          support={item.support}
        />
      ))}
    </div>
  );
}
