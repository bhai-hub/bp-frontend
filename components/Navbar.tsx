'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { setIsToolbarOpen } = useAccessibility();

  const closeMenu = () => setMenuOpen(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'SUPER_ADMIN') return '/admin';
    if (user.role === 'HR_MANAGER') return '/hr';
    return '/employee';
  };

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Recognition', href: '/#recognition' },
    { label: 'Employee Experience', href: '/#employee-experience' },
    { label: 'Enterprise Benefits', href: '/#enterprise-benefits' },
  ];

  return (
    <nav className="site-nav navbar navbar-expand-lg" aria-label="Main navigation">
      <div className="container">
        <Link
          className="navbar-brand"
          href="/"
          onClick={closeMenu}
          aria-label="Brownie Points Homepage"
        >
          <span className="brand-mark" aria-hidden="true">BP</span>
          <span>Brownie Points</span>
        </Link>

        <div className="d-flex align-items-center gap-2 d-lg-none">
          {/* Mobile Accessibility Button */}
          <button
            type="button"
            className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center p-2"
            onClick={() => setIsToolbarOpen(true)}
            aria-label="Open accessibility options"
            style={{ width: 38, height: 38 }}
          >
            <i className="bi bi-universal-access fs-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="navbar-toggler border-0"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="main-navbar-content"
          >
            <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true" style={{ fontSize: 24, color: 'var(--orange-primary)' }} />
          </button>
        </div>

        <div id="main-navbar-content" className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}>
          <ul className="navbar-nav mx-auto gap-0">
            {navLinks.map((item) => (
              <li className="nav-item" key={item.label}>
                <Link
                  className="nav-link"
                  href={item.href}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions d-flex align-items-center gap-2">
            {/* Desktop Accessibility Toggle */}
            <button
              type="button"
              className="btn btn-sm d-none d-lg-inline-flex align-items-center gap-1 me-2"
              onClick={() => setIsToolbarOpen(true)}
              aria-label="Accessibility settings (WCAG AA)"
              style={{
                background: 'var(--orange-light)',
                border: '1px solid var(--orange-border)',
                color: 'var(--orange-primary)',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 13,
                fontWeight: 600,
              }}
              title="Accessibility options (High contrast, text size, reduced motion)"
            >
              <i className="bi bi-universal-access" aria-hidden="true" />
              <span>A11y</span>
            </button>

            {user ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="text-muted small me-1 fw-semibold">
                  {user.firstName} ({user.role})
                </span>
                <Link
                  href={getDashboardLink()}
                  className="btn btn-sm btn-outline-primary"
                  onClick={closeMenu}
                >
                  <i className="bi bi-grid-fill me-1" aria-hidden="true"></i> Dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="btn btn-sm btn-ghost-outline"
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="nav-sign-in" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-nav-cta"
                  onClick={closeMenu}
                >
                  Request Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
