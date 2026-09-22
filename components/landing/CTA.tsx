import React from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-lg-7">
            <span className="section-eyebrow">Get Started Today</span>
            <h2 className="cta-title">
              Build a Culture Where Every Contribution Counts
            </h2>
            <p className="cta-body">
              Join forward-thinking organisations already using Brownie Points to make recognition transparent, fair, and verifiable. Your team&apos;s hard work deserves a permanent record — not a fleeting email.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Link href="/contact" className="btn btn-primary-cta">
                <i className="bi bi-box-arrow-in-right me-2" />
                Request a Free Demo
              </Link>
              <a
                href="http://localhost:5000/api/docs"
                target="_blank"
                rel="noreferrer"
                className="btn"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 4,
                  padding: "11px 22px",
                }}
              >
                View API Documentation
              </a>
            </div>
          </div>
          <div className="col-lg-5">
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 5,
                padding: "26px 28px",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: 0.7, color: "rgba(255,255,255,0.35)", marginBottom: 18 }}>
                Why Organisations Choose Us
              </div>
              {[
                "Fully auditable blockchain point ledger",
                "Employer and peer-to-peer recognition",
                "No rankings — equal footing for all employees",
                "SOC 2 compliant, GDPR-ready infrastructure",
                "Integrates with existing HR and payroll systems",
                "Dedicated onboarding and compliance support",
              ].map((item, i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  <i className="bi bi-check-circle" style={{ color: "#5ECF8A", flexShrink: 0, fontSize: 14 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
