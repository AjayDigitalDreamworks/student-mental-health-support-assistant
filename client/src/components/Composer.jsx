import { useState } from "react";

export default function Composer({ onSend, loading }) {
  const [value, setValue] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        placeholder="Type what you are feeling..."
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </form>
  );
}
