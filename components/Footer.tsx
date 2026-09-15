import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center text-white"
                style={{ width: '28px', height: '28px', backgroundColor: 'var(--primary-blue)', fontWeight: 'bold' }}
              >
                BP
              </div>
              <span className="brand-title fs-5">Brownie Points</span>
            </div>
            <p className="text-muted small mb-3" style={{ maxWidth: '320px' }}>
              The authoritative enterprise infrastructure for corporate recognition, employee retention awards, and transparent transactional value accounting.
            </p>
            <div className="text-muted small">
              &copy; {new Date().getFullYear()} Brownie Points Enterprise Inc. All rights reserved.
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-uppercase fw-bold text-dark small mb-3">Architecture</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2 text-muted">
              <li>Authoritative Ledger</li>
              <li>Multi-Tenancy Isolation</li>
              <li>PostgreSQL Source of Truth</li>
              <li>Role-Based Access</li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-uppercase fw-bold text-dark small mb-3">Portals</h6>
            <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
              <li><Link href="/login" className="text-muted text-decoration-none">Super Admin Portal</Link></li>
              <li><Link href="/login" className="text-muted text-decoration-none">HR Manager Portal</Link></li>
              <li><Link href="/login" className="text-muted text-decoration-none">Employee Self-Service</Link></li>
              <li><a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer" className="text-muted text-decoration-none">REST API Swagger</a></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-12">
            <h6 className="text-uppercase fw-bold text-dark small mb-3">Enterprise Compliance</h6>
            <p className="text-muted small mb-2">
              Strict audit trails, immutable transaction ledgers, centralized organization tenancy, and deterministic balance operations.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-light text-dark border py-2 px-2 fw-normal">SOC2 Compliant Architecture</span>
              <span className="badge bg-light text-dark border py-2 px-2 fw-normal">Zero Blockchain Dependency</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
