import React from "react";

const testimonials = [
  {
    quote: "Brownie Points fundamentally changed how we recognise effort. Every award is traceable, every reason is documented — our HR audits went from two weeks to two hours.",
    name: "Caroline Ashworth",
    title: "Chief People Officer",
    company: "Meridian Financial Group",
    initials: "CA",
  },
  {
    quote: "We tried three different recognition platforms before this. None of them gave us the financial-grade accountability Brownie Points does. The blockchain ledger is genuinely game-changing for governance.",
    name: "Rajesh Menon",
    title: "VP Engineering",
    company: "Synapse Technologies",
    initials: "RM",
  },
  {
    quote: "Our employees trust the system because there are no politics — no rankings, no manager favouritism. Points are awarded for documented reasons and recorded permanently. That transparency matters.",
    name: "Fiona Delacroix",
    title: "Head of HR Operations",
    company: "Crestline Logistics",
    initials: "FD",
  },
  {
    quote: "The multi-tenant isolation means each department operates independently with its own budget. It scales exactly how a large enterprise needs it to, without any data bleed between teams.",
    name: "David Okonkwo",
    title: "Enterprise IT Director",
    company: "Atlas Healthcare Systems",
    initials: "DO",
  },
  {
    quote: "Rolling out company-wide recognition used to take months of governance sign-off. Brownie Points had us live in under three weeks with full SOC 2 documentation ready on day one.",
    name: "Priya Sandhu",
    title: "Director of Talent Strategy",
    company: "Novara Consulting",
    initials: "PS",
  },
  {
    quote: "The audit trail alone justified the switch. Every point transaction — who gave it, who received it, why, when — is permanently on-chain. Our compliance team has never been happier.",
    name: "Tom Whitfield",
    title: "Chief Compliance Officer",
    company: "Harbour Capital Partners",
    initials: "TW",
  },
];

export default function Testimonials() {
  return (
    <section style={{ background: "var(--bg)", padding: "clamp(48px, 8vw, 80px) 0" }}>
      <div className="container">
        <div className="text-center mb-4 mb-md-5">
          <span className="section-eyebrow">Trusted by Enterprise Teams</span>
          <h2 className="section-title mx-auto" style={{ maxWidth: 480 }}>
            What Leaders Are Saying
          </h2>
          <p className="section-body mx-auto text-center">
            HR directors, compliance officers, and engineering leaders on why Brownie Points is the recognition infrastructure their organisation actually trusts.
          </p>
        </div>

        <div className="row g-3">
          {testimonials.map((t) => (
            <div className="col-12 col-sm-6 col-lg-4" key={t.name}>
              <div className="testimonial-card">
                <i
                  className="bi bi-quote"
                  aria-hidden="true"
                  style={{ fontSize: 28, color: "var(--orange-primary)", opacity: 0.6, marginBottom: 12, display: "block", lineHeight: 1 }}
                />
                <p style={{ fontSize: 13.5, color: "var(--text-dark)", lineHeight: 1.7, flex: 1, marginBottom: 20 }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 8,
                      background: "linear-gradient(135deg, #FF6B00 0%, #FF8533 100%)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12.5,
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow: "0 3px 10px rgba(255, 107, 0, 0.25)",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{t.title} · {t.company}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
