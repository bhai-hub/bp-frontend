import React from "react";

const steps = [
  {
    n: "Step 01",
    title: "Organisation Procurement",
    body: "Administrators provision the organisation and execute simulated bulk BP purchases. Points are deposited into the company pool and recorded on an immutable ledger.",
    icon: "bi-building",
  },
  {
    n: "Step 02",
    title: "HR-Controlled Allocation",
    body: "HR managers oversee employees within strict tenant isolation. When recognising achievements, HR credits BP directly to employee wallets, decrementing the available organisation balance atomically.",
    icon: "bi-people",
  },
  {
    n: "Step 03",
    title: "Employee Recognition",
    body: "Employees and peers log into their personalised dashboard, viewing real-time point balances, complete with detailed reward rationales and achievement timestamps.",
    icon: "bi-person-check",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-section">
      <div className="container">
        <div className="text-center mb-5">
          <span className="section-eyebrow">Operational Workflow</span>
          <h2 className="section-title mx-auto" style={{ maxWidth: 500 }}>
            How Brownie Points Works
          </h2>
          <p className="section-body mx-auto" style={{ textAlign: "center" }}>
            A structured 3-tier architecture ensuring complete fiduciary governance from bulk corporate procurement down to employee wallet balances.
          </p>
        </div>

        <div className="row g-4">
          {steps.map((s) => (
            <div className="col-md-4" key={s.n}>
              <div className="step-card">
                <div className="step-number">{s.n}</div>
                <i className={`bi ${s.icon}`} style={{ fontSize: 24, color: "var(--navy)", marginBottom: 12, display: "block" }} />
                <div className="step-title">{s.title}</div>
                <p className="step-body mb-0">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
