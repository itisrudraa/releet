const links = [
  { label: "GitHub", url: "https://github.com/itisrudraa", icon: "⌥" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/itisrudra/", icon: "in" },
];

const tips = ["Review within 24h of solving", "Snooze hard problems by +3d", "Aim for 0 due by end of day"];

export default function Footer() {
  return <footer style={{ background: "#111111", borderTop: "1px solid #1a1a2e", padding: "28px 0 24px", marginTop: "auto" }}>
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 36px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}><span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} /><strong style={{ fontSize: "14px", color: "#e2e8f0", fontFamily: "'JetBrains Mono', monospace" }}>ReLeet</strong></div>
          <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6 }}>Track, review, and retain coding interview problems.<br />Built for long-term mastery.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}><span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>CONNECT</span>{links.map((link) => <a key={link.label} href={link.url} target="_blank" rel="noreferrer" style={{ color: "#6b7280", fontSize: "12px", fontFamily: "'JetBrains Mono', monospace", textDecoration: "none" }}><span style={{ display: "inline-flex", width: "20px", height: "20px", alignItems: "center", justifyContent: "center", marginRight: "8px", background: "#1a1a2e", color: "#ffa116", borderRadius: "4px" }}>{link.icon}</span>{link.label}</a>)}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}><span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>PRO TIPS</span>{tips.map((tip) => <span key={tip} style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}><span style={{ color: "#fbbf24", marginRight: "6px" }}>›</span>{tip}</span>)}</div>
      </div>
      <div style={{ height: "1px", background: "#1a1a2e", marginBottom: "16px" }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}><span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>Made with <span style={{ color: "#f87171" }}>♥</span> by <a href="https://github.com/itisrudraa" target="_blank" rel="noreferrer" style={{ color: "#ffa116", textDecoration: "none", fontWeight: 700 }}>Rudra</a></span><span style={{ fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>ReLeet v1.0 · Chrome Extension</span></div>
    </div>
  </footer>;
}
