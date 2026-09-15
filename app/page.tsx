import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="py-5 py-lg-6 border-bottom bg-light">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="enterprise-badge enterprise-badge-blue mb-3">
                Enterprise Recognition Infrastructure
              </span>
              <h1 className="display-5 fw-bold text-dark mb-3" style={{ letterSpacing: '-0.03em' }}>
                The Authoritative Enterprise Currency for Employee Recognition & Retention
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '1.15rem' }}>
                Empower your workforce with a deterministic, auditable, and transparent recognition platform. Eliminate arbitrary reward schemes and establish an authoritative value ledger for enterprise appreciation.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/login" className="btn btn-primary px-4 py-2 fs-6">
                  Launch Enterprise Portal <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <a href="#how-it-works" className="btn btn-outline-secondary px-4 py-2 fs-6">
                  Explore Architecture
                </a>
              </div>

              <div className="d-flex gap-4 mt-4 pt-2 border-top">
                <div>
                  <div className="fw-bold fs-5 text-dark">100%</div>
                  <div className="text-muted small">PostgreSQL Authoritative Truth</div>
                </div>
                <div>
                  <div className="fw-bold fs-5 text-dark">Multi-Tenant</div>
                  <div className="text-muted small">Strict Organization Isolation</div>
                </div>
                <div>
                  <div className="fw-bold fs-5 text-dark">Audit Ready</div>
                  <div className="text-muted small">Immutable Transaction Ledgers</div>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="enterprise-card p-4 shadow-sm bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="fw-bold small text-uppercase text-secondary">Live Ledger Preview</span>
                  <span className="enterprise-badge enterprise-badge-active">Active Node</span>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Organization Balance</div>
                  <div className="fs-3 fw-bold text-dark">215,000 BP</div>
                  <div className="small text-success">
                    <i className="bi bi-shield-check me-1"></i> Available for employee allocation
                  </div>
                </div>

                <div className="border p-3 bg-light mb-3">
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Recent Transaction</span>
                    <span>Just Now</span>
                  </div>
                  <div className="fw-semibold text-dark small">Senior Staff Engineer Mentorship Award</div>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="text-primary fw-bold">+2,500 BP</span>
                    <span className="badge bg-white text-secondary border">ALLOCATION</span>
                  </div>
                </div>

                <div className="d-grid">
                  <Link href="/login" className="btn btn-sm btn-outline-primary">
                    Test Corporate Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How Brownie Points Works */}
      <section id="how-it-works" className="py-5 border-bottom bg-white">
        <div className="container py-4">
          <div className="text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <span className="enterprise-badge enterprise-badge-blue mb-2">Operational Workflow</span>
            <h2 className="fw-bold text-dark">How Brownie Points Works</h2>
            <p className="text-secondary">
              A structured 3-tier architecture ensuring complete fiduciary governance from bulk corporate procurement down to employee wallet balances.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="enterprise-card h-100 p-4">
                <div
                  className="d-flex align-items-center justify-content-center text-primary bg-light mb-3"
                  style={{ width: '48px', height: '48px', border: '1px solid var(--border-color)' }}
                >
                  <i className="bi bi-building fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">1. Organization Procurement</h5>
                <p className="text-muted small mb-0">
                  Super Administrators provision organizations and execute simulated bulk BP purchases. Points are deposited into the company available pool and recorded in an immutable ledger.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="enterprise-card h-100 p-4">
                <div
                  className="d-flex align-items-center justify-content-center text-primary bg-light mb-3"
                  style={{ width: '48px', height: '48px', border: '1px solid var(--border-color)' }}
                >
                  <i className="bi bi-person-check fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">2. HR Controlled Allocation</h5>
                <p className="text-muted small mb-0">
                  HR Managers oversee employees within strict tenant isolation. When recognizing achievements, HR credits BP directly to employee wallets, decrementing available organization balance atomically.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="enterprise-card h-100 p-4">
                <div
                  className="d-flex align-items-center justify-content-center text-primary bg-light mb-3"
                  style={{ width: '48px', height: '48px', border: '1px solid var(--border-color)' }}
                >
                  <i className="bi bi-wallet2 fs-4"></i>
                </div>
                <h5 className="fw-bold text-dark mb-2">3. Employee Value Realization</h5>
                <p className="text-muted small mb-0">
                  Employees log in to their personalized dashboard, viewing real-time Spendable, Loyalty, and Lifetime balances, complete with detailed reward rationales and achievement timestamps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recognition */}
      <section id="recognition" className="py-5 border-bottom bg-light">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="enterprise-badge enterprise-badge-blue mb-2">Recognition Engine</span>
              <h2 className="fw-bold text-dark mb-3">
                Transparent Recognition, Anchored in Tangible Value
              </h2>
              <p className="text-secondary mb-4">
                Traditional applause and digital badges fade quickly. Brownie Points turns appreciation into a tangible, measurable company-backed asset with permanent lifetime visibility.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3">
                  <div className="text-primary fs-5"><i className="bi bi-check2-square"></i></div>
                  <div>
                    <div className="fw-semibold text-dark">One Unified Enterprise Currency</div>
                    <div className="text-muted small">No fragmented points programs. A single cohesive BP currency across your entire enterprise organization.</div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="text-primary fs-5"><i className="bi bi-check2-square"></i></div>
                  <div>
                    <div className="fw-semibold text-dark">Strict Tenancy Isolation</div>
                    <div className="text-muted small">Each organization operates in complete isolation. Company data, employee codes, and reward policies never cross borders.</div>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="text-primary fs-5"><i className="bi bi-check2-square"></i></div>
                  <div>
                    <div className="fw-semibold text-dark">Atomic Ledger Transactions</div>
                    <div className="text-muted small">Every credit is backed by a transactional database record, preventing double-allocation and ensuring mathematical accuracy.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="enterprise-card p-4 bg-white">
                <h6 className="fw-bold text-dark mb-3 pb-2 border-bottom">Recognition Categories Supported</h6>
                <div className="list-group list-group-flush small">
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <div>
                      <div className="fw-semibold text-dark">Milestone & Delivery Awards</div>
                      <div className="text-muted">On-time sprint completions, critical releases, and production deployments</div>
                    </div>
                    <span className="enterprise-badge enterprise-badge-blue">Core</span>
                  </div>

                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <div>
                      <div className="fw-semibold text-dark">Peer Mentorship & Knowledge Transfer</div>
                      <div className="text-muted">Cross-team documentation, onboarding facilitation, and tech talks</div>
                    </div>
                    <span className="enterprise-badge enterprise-badge-blue">Culture</span>
                  </div>

                  <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <div>
                      <div className="fw-semibold text-dark">Customer Obsession & Quality</div>
                      <div className="text-muted">SLA adherence, zero-defect releases, and incident response heroism</div>
                    </div>
                    <span className="enterprise-badge enterprise-badge-blue">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Employee Experience */}
      <section id="experience" className="py-5 border-bottom bg-white">
        <div className="container py-4">
          <div className="text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <span className="enterprise-badge enterprise-badge-blue mb-2">Employee Portal</span>
            <h2 className="fw-bold text-dark">An Intuitive, Transparent Employee Experience</h2>
            <p className="text-secondary">
              Employees can immediately see how their hard work contributes to their wallet growth, with clear separation between spendable and lifetime career recognition.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="metric-box bg-light text-center p-4">
                <i className="bi bi-wallet-fill text-primary fs-2 mb-2 d-block"></i>
                <div className="metric-label">Spendable Brownie Points</div>
                <div className="metric-value text-primary mb-2">20,000 BP</div>
                <p className="text-muted small mb-0">
                  Ready to be redeemed for enterprise gift cards, wellness perks, and company rewards.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="metric-box bg-light text-center p-4">
                <i className="bi bi-shield-lock-fill text-dark fs-2 mb-2 d-block"></i>
                <div className="metric-label">Loyalty Brownie Points</div>
                <div className="metric-value text-dark mb-2">5,000 BP</div>
                <p className="text-muted small mb-0">
                  Vested tenure bonus unlocked automatically during work anniversaries and tenure thresholds.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="metric-box bg-light text-center p-4">
                <i className="bi bi-trophy-fill text-warning fs-2 mb-2 d-block"></i>
                <div className="metric-label">Lifetime Earned Points</div>
                <div className="metric-value text-dark mb-2">25,000 BP</div>
                <p className="text-muted small mb-0">
                  An immutable score representing the cumulative total of all recognition points ever earned.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Company Benefits */}
      <section id="benefits" className="py-5 border-bottom bg-light">
        <div className="container py-4">
          <div className="text-center mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            <span className="enterprise-badge enterprise-badge-blue mb-2">ROI & Compliance</span>
            <h2 className="fw-bold text-dark">Enterprise-Grade Company Benefits</h2>
            <p className="text-secondary">
              Built to meet the stringent security, governance, and financial accounting needs of modern corporations.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="enterprise-card p-4 h-100 bg-white">
                <i className="bi bi-graph-up-arrow text-primary fs-3 mb-2 d-block"></i>
                <h6 className="fw-bold text-dark">Boost Retention</h6>
                <p className="text-muted small mb-0">
                  Increase organizational morale and reduce turnover by providing predictable, frequent recognition.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="enterprise-card p-4 h-100 bg-white">
                <i className="bi bi-currency-dollar text-primary fs-3 mb-2 d-block"></i>
                <h6 className="fw-bold text-dark">Controlled Budgets</h6>
                <p className="text-muted small mb-0">
                  Set organization-wide BP policies, monthly caps per employee, and discretionary HR limits.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="enterprise-card p-4 h-100 bg-white">
                <i className="bi bi-file-earmark-lock text-primary fs-3 mb-2 d-block"></i>
                <h6 className="fw-bold text-dark">Audit Ready</h6>
                <p className="text-muted small mb-0">
                  Detailed ledger trails capture who issued points, who received them, timestamps, and exact reference codes.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="enterprise-card p-4 h-100 bg-white">
                <i className="bi bi-shield-check text-primary fs-3 mb-2 d-block"></i>
                <h6 className="fw-bold text-dark">Zero Speculation</h6>
                <p className="text-muted small mb-0">
                  No cryptocurrency, no blockchain volatility, and zero financial ambiguity. Strict enterprise accounting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-5 bg-white">
        <div className="container py-4 text-center" style={{ maxWidth: '800px' }}>
          <span className="enterprise-badge enterprise-badge-blue mb-3">Ready to deploy?</span>
          <h2 className="display-6 fw-bold text-dark mb-3">
            Deploy Brownie Points Across Your Organization
          </h2>
          <p className="text-secondary lead mb-4">
            Test the live platform immediately using pre-configured enterprise demo accounts for Super Admin, HR Manager, and Employee personas.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/login" className="btn btn-primary px-4 py-2 fs-6">
              Sign In to Demo Portals <i className="bi bi-box-arrow-in-right ms-2"></i>
            </Link>
            <a
              href="http://localhost:5000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline-secondary px-4 py-2 fs-6"
            >
              Inspect OpenAPI Docs
            </a>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
