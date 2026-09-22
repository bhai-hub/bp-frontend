import React from 'react';
import Link from 'next/link';

type Props = {
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
};

const sitemap = [
  {
    heading: 'Platform',
    links: [
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Recognition Engine', href: '/#recognition' },
      { label: 'Employee Experience', href: '/#employee-experience' },
      { label: 'Enterprise Benefits', href: '/#enterprise-benefits' },
    ],
  },
  {
    heading: 'Architecture',
    links: [
      { label: 'Atomic Ledger', href: '/#how-it-works' },
      { label: 'Multi-Tenancy Isolation', href: '/#recognition' },
      { label: 'PostgreSQL Source of Truth', href: '/#how-it-works' },
      { label: 'Role-Based Access Control', href: '/#benefits' },
    ],
  },
  {
    heading: 'Portals',
    links: [
      { label: 'Super Admin Portal', href: '/login' },
      { label: 'HR Manager Portal', href: '/login' },
      { label: 'Employee Self-Service', href: '/login' },
      { label: 'REST API Swagger', href: 'http://localhost:5000/api/docs' },
    ],
  },
  {
    heading: 'Compliance',
    links: [
      { label: 'SOC 2 Architecture', href: '/#enterprise-benefits' },
      { label: 'GDPR Data Isolation', href: '/#enterprise-benefits' },
      { label: 'Audit Trail Export', href: '/#enterprise-benefits' },
      { label: 'Security Overview', href: '/#enterprise-benefits' },
    ],
  },
];

export const Footer: React.FC<Props> = ({ onOpenTerms, onOpenPrivacy }) => {
  return (
    <footer className="site-footer">
      <div className="container">
        {/* Brand + sitemap */}
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="footer-brand">
              <span className="brand-mark">BP</span>
              Brownie Points
            </div>
            <p className="footer-desc">
              The authoritative enterprise infrastructure for corporate recognition, employee-retention awards, and transparent transactional value accounting.
            </p>
            <div className="d-flex gap-2 mt-3">
              {['bi-linkedin', 'bi-twitter-x', 'bi-github'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 13,
                    textDecoration: 'none',
                    transition: 'color 0.13s',
                  }}
                >
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {sitemap.map((col) => (
            <div className="col-6 col-md-3 col-lg-2" key={col.heading}>
              <div className="footer-heading">{col.heading}</div>
              {col.links.map((link) => (
                <Link key={link.label} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Sitemap label */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              color: 'rgba(255,255,255,0.22)',
              marginBottom: 10,
            }}
          >
            Site Map
          </div>
          <div className="d-flex flex-wrap gap-2">
            {[
              { label: 'Home', href: '/' },
              { label: 'How It Works', href: '/#how-it-works' },
              { label: 'Recognition Engine', href: '/#recognition' },
              { label: 'Employee Experience', href: '/#employee-experience' },
              { label: 'Enterprise Benefits', href: '/#enterprise-benefits' },
              { label: 'Testimonials', href: '/#testimonials' },
              { label: 'API Docs', href: 'http://localhost:5000/api/docs' },
              { label: 'Contact', href: '/contact' },
            ].map((page) => (
              <Link
                key={page.label}
                href={page.href}
                style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.28)',
                  textDecoration: 'none',
                  marginRight: 14,
                  transition: 'color 0.12s',
                }}
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="footer-copy">© 2026 Brownie Points Enterprise Inc. All rights reserved.</span>
          <div className="d-flex gap-3 align-items-center">
            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="footer-link mb-0"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Privacy Policy
              </button>
            )}
            {onOpenTerms && (
              <button
                type="button"
                onClick={onOpenTerms}
                className="footer-link mb-0"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Terms &amp; Conditions
              </button>
            )}
            <span className="footer-link mb-0" style={{ cursor: 'default' }}>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
