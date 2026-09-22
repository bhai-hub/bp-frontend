import React from "react";

const pointTypes = [
  {
    label: "Spendable Points",
    value: "20,000 BP",
    accent: "var(--navy)",
    icon: "bi-wallet2",
    desc: "Ready to be redeemed for enterprise gift cards, wellness perks, and company rewards.",
  },
  {
    label: "Loyalty Points",
    value: "5,000 BP",
    accent: "var(--amber)",
    icon: "bi-shield-check",
    desc: "Vested tenure bonus unlocked automatically during work anniversaries and tenure thresholds.",
  },
  {
    label: "Lifetime Earned",
    value: "25,000 BP",
    accent: "var(--green)",
    icon: "bi-trophy",
    desc: "An immutable score representing the cumulative total of all recognition points ever earned.",
  },
];

const checklist = [
  "Real-time balance across all point categories",
  "Full transaction history with on-chain proof",
  "Reason-backed awards — know exactly why points were given",
  "Peer-to-peer recognition with employer co-signing",
  "No arbitrary rankings or leaderboard pressure",
];

export default function EmployeeExperience() {
  return (
    <section id="employee-experience" className="employee-section">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          {/* Left */}
          <div className="col-lg-5">
            <span className="section-eyebrow">Employee Portal</span>
            <h2 className="section-title">
              An Intuitive, Transparent Employee Experience
            </h2>
            <p className="section-body mb-4">
              Employees see immediately how their hard work contributes to their wallet growth, with clear separation between spendable and lifetime career recognition.
            </p>
            <ul style={{ paddingLeft: 0, listStyle: "none", margin: 0 }}>
              {checklist.map((item) => (
                <li
                  key={item}
                  style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--muted)", marginBottom: 10, lineHeight: 1.55 }}
                >
                  <i className="bi bi-check-lg mt-1" style={{ color: "var(--green)", flexShrink: 0, fontSize: 14 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right */}
          <div className="col-lg-7">
            <div className="row g-3">
              {pointTypes.map((pt) => (
                <div className="col-6 col-md-4" key={pt.label}>
                  <div
                    className="point-type-card"
                    style={{ borderTop: `3px solid ${pt.accent}` }}
                  >
                    <i className={`bi ${pt.icon}`} style={{ fontSize: 20, color: pt.accent, marginBottom: 10, display: "block" }} />
                    <div className="pt-label">{pt.label}</div>
                    <div className="pt-value" style={{ color: pt.accent }}>{pt.value}</div>
                    <p className="pt-desc mb-0">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini activity feed */}
            <div
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 5,
                marginTop: 20,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  background: "#fff",
                  borderBottom: "1px solid var(--border)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  color: "var(--muted)",
                }}
              >
                Recent Activity
              </div>
              {[
                { pts: "+500", label: "Zero-downtime infra migration", from: "Awarded by HR Manager", time: "Today 09:14" },
                { pts: "+150", label: "Q3 sprint documentation", from: "Peer nomination · James O.", time: "Today 08:50" },
                { pts: "+300", label: "CI/CD pipeline 41% faster", from: "Awarded by HR Manager", time: "Sep 13" },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 16px",
                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                    background: "#fff",
                  }}
                >
                  <span
                    style={{
                      background: "rgba(26,92,56,0.1)",
                      color: "var(--green)",
                      fontWeight: 800,
                      fontSize: 12,
                      padding: "3px 9px",
                      borderRadius: 3,
                      border: "1px solid rgba(26,92,56,0.2)",
                      flexShrink: 0,
                    }}
                  >
                    {row.pts} BP
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{row.label}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{row.from}</div>
                  </div>
                  <span className="d-none d-sm-inline" style={{ fontSize: 11, color: "var(--muted)", flexShrink: 0 }}>{row.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
