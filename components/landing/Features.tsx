import React from "react";

const features = [
  {
    icon: "bi-coin",
    title: "One Unified Enterprise Currency",
    body: "No fragmented points programs. A single cohesive BP currency across your entire enterprise organisation.",
  },
  {
    icon: "bi-shield-lock",
    title: "Strict Tenancy Isolation",
    body: "Each organisation operates in complete isolation. Company data, employee codes, and reward policies never cross borders.",
  },
  {
    icon: "bi-journal-check",
    title: "Atomic Ledger Transactions",
    body: "Every credit is backed by a transactional database record, preventing double-allocation and ensuring mathematical accuracy.",
  },
  {
    icon: "bi-link-45deg",
    title: "Blockchain Hash Verification",
    body: "Each transaction carries a SHA-256 hash chained to the previous block, producing a tamper-evident ledger that any auditor can verify independently.",
  },
];

const categories = [
  { label: "Milestone & Delivery", tag: "CORE", color: "var(--navy)", bg: "rgba(36,59,85,0.07)", border: "rgba(36,59,85,0.18)", desc: "On-time sprint completions, critical releases, and production deployments." },
  { label: "Peer Mentorship & Knowledge Transfer", tag: "CULTURE", color: "var(--amber)", bg: "rgba(140,83,24,0.07)", border: "rgba(140,83,24,0.2)", desc: "Cross-team documentation, onboarding facilitation, and tech talks." },
  { label: "Customer Obsession & Quality", tag: "OPERATIONAL", color: "var(--green)", bg: "rgba(33,92,58,0.07)", border: "rgba(33,92,58,0.2)", desc: "SLA adherence, zero-defect releases, and incident response heroics." },
];

export default function Features() {
  return (
    <section id="recognition" className="features-section">
      <div className="container">
        <div className="row g-4 g-lg-5 align-items-start">
          {/* Left */}
          <div className="col-lg-5">
            <span className="section-eyebrow">Recognition Engine</span>
            <h2 className="section-title">
              Transparent Recognition, Anchored in Tangible Value
            </h2>
            <p className="section-body mb-4">
              Traditional applause and digital badges fade quickly. Brownie Points turns appreciation into a measurable, company-backed asset with permanent lifetime visibility.
            </p>
            {features.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 4,
                    background: "rgba(36,59,85,0.07)",
                    border: "1px solid rgba(36,59,85,0.14)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--navy)",
                    fontSize: 15,
                  }}
                >
                  <i className={`bi ${f.icon}`} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{f.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="col-lg-7">
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 5,
                padding: "26px 26px",
              }}
            >
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.8, color: "var(--muted)", marginBottom: 18 }}>
                Recognition Categories Supported
              </div>
              {categories.map((c) => (
                <div
                  key={c.label}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 5,
                    padding: "14px 16px",
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 3 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>{c.desc}</div>
                  </div>
                  <span
                    className="cat-tag"
                    style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, flexShrink: 0 }}
                  >
                    {c.tag}
                  </span>
                </div>
              ))}

              <div
                style={{
                  marginTop: 16,
                  padding: "12px 14px",
                  background: "rgba(36,59,85,0.05)",
                  border: "1px solid rgba(36,59,85,0.12)",
                  borderRadius: 4,
                  fontSize: 12,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}
              >
                <i className="bi bi-info-circle me-2" aria-hidden="true" style={{ color: "var(--navy)" }} />
                No ranking system. Every employee&apos;s balance is independent — points reflect contribution, not competition.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
