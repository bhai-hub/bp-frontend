'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
    <nav className="site-nav navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand" href="/" onClick={closeMenu}>
          <span className="brand-mark">BP</span>
          Brownie Points
        </Link>

        <button
          className="navbar-toggler border-0"
          style={{ outline: 'none', boxShadow: 'none' }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${menuOpen ? 'bi-x' : 'bi-list'} text-white`} style={{ fontSize: 22 }} />
        </button>

        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}>
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

          <div className="nav-actions">
            {user ? (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="text-white-50 small me-1">
                  {user.firstName} ({user.role})
                </span>
                <Link
                  href={getDashboardLink()}
                  className="btn btn-sm"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: 4,
                  }}
                  onClick={closeMenu}
                >
                  <i className="bi bi-grid-fill me-1"></i> Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="btn btn-sm text-white-50"
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 4,
                  }}
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
