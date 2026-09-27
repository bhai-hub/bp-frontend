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
  { label: "Milestone & Delivery", tag: "CORE", color: "var(--orange-primary)", bg: "var(--orange-light)", border: "var(--orange-border)", desc: "On-time sprint completions, critical releases, and production deployments." },
  { label: "Peer Mentorship & Knowledge Transfer", tag: "CULTURE", color: "#E65D00", bg: "#FFF3E0", border: "#FFD8B3", desc: "Cross-team documentation, onboarding facilitation, and tech talks." },
  { label: "Customer Obsession & Quality", tag: "OPERATIONAL", color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", desc: "SLA adherence, zero-defect releases, and incident response heroics." },
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
                  borderBottom: "1px solid var(--orange-border)",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: "var(--orange-light)",
                    border: "1px solid var(--orange-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "var(--orange-primary)",
                    fontSize: 16,
                  }}
                >
                  <i className={`bi ${f.icon}`} aria-hidden="true" />
                </div>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-dark)", marginBottom: 4 }}>{f.title}</div>
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
                border: "1px solid var(--orange-border)",
                borderRadius: 12,
                padding: "28px 28px",
                boxShadow: "0 8px 28px rgba(255, 107, 0, 0.05)",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: 0.8, color: "var(--orange-primary)", marginBottom: 18 }}>
                Recognition Categories Supported
              </div>
              {categories.map((c) => (
                <div
                  key={c.label}
                  style={{
                    background: "#ffffff",
                    border: "1px solid var(--orange-border)",
                    borderRadius: 10,
                    padding: "16px 18px",
                    marginBottom: 12,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 14,
                    boxShadow: "0 2px 8px rgba(255, 107, 0, 0.03)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-dark)", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>{c.desc}</div>
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
                  marginTop: 18,
                  padding: "14px 16px",
                  background: "var(--orange-light)",
                  border: "1px solid var(--orange-border)",
                  borderRadius: 8,
                  fontSize: 12.5,
                  color: "var(--muted)",
                  lineHeight: 1.6,
                }}
              >
                <i className="bi bi-info-circle me-2" aria-hidden="true" style={{ color: "var(--orange-primary)" }} />
                No ranking system. Every employee&apos;s balance is independent — points reflect contribution, not competition.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
