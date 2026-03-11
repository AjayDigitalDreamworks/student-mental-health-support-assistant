export default function RiskBanner({ risk, category }) {
  if (!risk) return null;

  const tone = risk === "critical" || risk === "high" ? "danger" : risk === "moderate" ? "warn" : "safe";

  return (
    <div className={`risk-banner ${tone}`}>
      <strong>Detected:</strong> {category?.replaceAll("_", " ") || "general support"} · <strong>Risk:</strong> {risk}
    </div>
  );
}
