import React from "react";
import Link from "next/link";

export default function Hero() {
  const awards = [
    { icon: "bi-cpu", label: "Milestone & Delivery", desc: "On-time releases, production deployments, sprint completions" },
    { icon: "bi-people", label: "Peer Collaboration", desc: "Cross-team documentation, mentorship, onboarding support" },
    { icon: "bi-lightbulb", label: "Innovation", desc: "Process improvements, cost savings, performance gains" },
    { icon: "bi-shield-check", label: "Conduct & Integrity", desc: "Audit findings, incident response, compliance adherence" },
  ];

  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="hero-eyebrow">Blockchain-Verified Employee Recognition</span>
            <h1 className="hero-title">
              Recognition That&apos;s <em>Earned, Recorded</em> and Impossible to Dispute
            </h1>
            <p className="hero-body">
              Brownie Points replaces arbitrary reward programs with a transparent, deterministic points system — every award on-chain, every reason on record, every employee equal.
            </p>
            <div className="hero-cta-row">
              <Link href="/contact" className="btn btn-primary-cta">
                Request a Demo <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="btn btn-ghost-cta">
                Explore Architecture
              </a>
            </div>
            <div className="hero-stats">
              {[
                { label: "PostgreSQL Source of Truth", value: "100%" },
                { label: "Multi-Tenant", value: "Isolated" },
                { label: "Audit Ready", value: "Immutable" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="hero-stat-label">{s.label}</div>
                  <div className="hero-stat-value">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-6">
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 5,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
                  padding: "12px 18px",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: 0.7,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Recognition Categories
              </div>
              {awards.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "14px 18px",
                    borderBottom: i < awards.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 4,
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 15,
                    }}
                  >
                    <i className={`bi ${a.icon}`} aria-hidden="true" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{a.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{a.desc}</div>
                  </div>
                </div>
              ))}
              <div
                style={{
                  padding: "12px 18px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.04)",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                <i className="bi bi-info-circle me-2" aria-hidden="true" style={{ color: "var(--amber)" }} />
                No rankings. No competition. Points reflect contribution only.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
