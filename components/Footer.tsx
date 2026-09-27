'use client';

import React from 'react';
import Link from 'next/link';
import { useAccessibility } from '../context/AccessibilityContext';

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
      { label: 'Role-Based Access Control', href: '/#enterprise-benefits' },
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
      { label: 'WCAG AA Accessibility', href: '/#enterprise-benefits' },
    ],
  },
];

export const Footer: React.FC<Props> = ({ onOpenTerms, onOpenPrivacy }) => {
  const { setIsToolbarOpen } = useAccessibility();

  return (
    <footer className="site-footer" role="contentinfo" aria-label="Site footer">
      <div className="container">
        {/* Brand + sitemap */}
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="footer-brand">
              <span className="brand-mark" aria-hidden="true">BP</span>
              Brownie Points
            </div>
            <p className="footer-desc text-white" style={{ opacity: 0.85 }}>
              The authoritative enterprise infrastructure for corporate recognition, employee-retention awards, and transparent transactional value accounting.
            </p>
            <div className="d-flex gap-2 mt-3" aria-label="Social media channels">
              {[
                { icon: 'bi-linkedin', label: 'Brownie Points on LinkedIn', href: '#' },
                { icon: 'bi-twitter-x', label: 'Brownie Points on X', href: '#' },
                { icon: 'bi-github', label: 'Brownie Points on GitHub', href: '#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: 14,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {sitemap.map((col) => (
            <div className="col-6 col-md-3 col-lg-2" key={col.heading}>
              <div className="footer-heading text-white fw-bold">{col.heading}</div>
              {col.links.map((link) => (
                <Link key={link.label} href={link.href} className="footer-link d-block mb-1 text-white" style={{ opacity: 0.85 }}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Sitemap label */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              color: '#cbd5e1',
              marginBottom: 10,
            }}
          >
            Site Navigation Map
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
                  fontSize: 12,
                  color: '#e2e8f0',
                  textDecoration: 'none',
                  marginRight: 14,
                }}
              >
                {page.label}
              </Link>
            ))}
          </div>
        </div>

        <hr className="footer-divider" style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="footer-copy text-white" style={{ opacity: 0.85 }}>
            © 2026 Brownie Points Enterprise Inc. All rights reserved.
          </span>
          <div className="d-flex gap-3 align-items-center flex-wrap">
            <button
              type="button"
              onClick={() => setIsToolbarOpen(true)}
              className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-1"
              style={{ fontSize: 12, padding: '4px 8px' }}
              aria-label="Open accessibility settings dialog"
            >
              <i className="bi bi-universal-access" aria-hidden="true" />
              <span>Accessibility (WCAG AA)</span>
            </button>

            {onOpenPrivacy && (
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="footer-link mb-0 text-white"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', opacity: 0.85 }}
              >
                Privacy Policy
              </button>
            )}
            {onOpenTerms && (
              <button
                type="button"
                onClick={onOpenTerms}
                className="footer-link mb-0 text-white"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', opacity: 0.85 }}
              >
                Terms &amp; Conditions
              </button>
            )}
            <span className="footer-link mb-0 text-white" style={{ cursor: 'default', opacity: 0.85 }}>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
