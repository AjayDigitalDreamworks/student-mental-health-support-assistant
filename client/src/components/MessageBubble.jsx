export default function MessageBubble({ role, text, support }) {
  return (
    <div className={`message-row ${role}`}>
      <div className={`bubble ${role}`}>
        <p>{text}</p>
        {role === "assistant" && support ? (
          <div className="support-box">
            {support.steps?.length ? (
              <>
                <h4>Helpful steps</h4>
                <ul>
                  {support.steps.map((step, index) => (
                    <li key={`${step}-${index}`}>{step}</li>
                  ))}
                </ul>
              </>
            ) : null}
            {support.nextAction ? (
              <p>
                <strong>Next action:</strong> {support.nextAction}
              </p>
            ) : null}
            {support.disclaimer ? <small>{support.disclaimer}</small> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
