import React from "react";

const benefits = [
  {
    icon: "bi-graph-up-arrow",
    title: "Boost Retention",
    body: "Increase organisational morale and reduce turnover by providing predictable, frequent recognition.",
  },
  {
    icon: "bi-currency-dollar",
    title: "Controlled Budgets",
    body: "Set organisation-wide BP policies, monthly caps per employee, and discretionary HR limits.",
  },
  {
    icon: "bi-file-earmark-text",
    title: "Audit Ready",
    body: "Detailed ledger trails capture who issued points, who received them, timestamps, and exact reference codes.",
  },
  {
    icon: "bi-shield-fill-check",
    title: "Zero Speculation",
    body: "No cryptocurrency volatility and zero financial ambiguity. Strict enterprise accounting throughout.",
  },
];

const complianceTags = [
  "SOC 2 Compliant Architecture",
  "Zero Blockchain Dependency",
  "GDPR-Ready Data Isolation",
  "Role-Based Access Control",
];

export default function EnterpriseBenefits() {
  return (
    <section id="enterprise-benefits" className="enterprise-section">
      <div className="container">
        <div className="text-center mb-5">
          <span className="section-eyebrow">ROI & Compliance</span>
          <h2 className="section-title mx-auto" style={{ maxWidth: 480 }}>
            Enterprise-Grade Company Benefits
          </h2>
          <p className="section-body mx-auto" style={{ textAlign: "center" }}>
            Built to meet the stringent security, governance, and financial accounting needs of modern corporations.
          </p>
        </div>

        <div className="row g-3 mb-4">
          {benefits.map((b) => (
            <div className="col-sm-6 col-lg-3" key={b.title}>
              <div className="benefit-card">
                <i className={`bi ${b.icon} benefit-icon`} aria-hidden="true" />
                <div className="benefit-title">{b.title}</div>
                <p className="benefit-body mb-0">{b.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
          {complianceTags.map((tag) => (
            <span
              key={tag}
              style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--navy)",
              }}
            >
              <i className="bi bi-check-circle-fill me-2" aria-hidden="true" style={{ color: "var(--green)", fontSize: 11 }} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
