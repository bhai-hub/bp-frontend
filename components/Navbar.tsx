'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'SUPER_ADMIN') return '/admin';
    if (user.role === 'HR_MANAGER') return '/hr';
    return '/employee';
  };

  return (
    <nav className="enterprise-navbar d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-4">
        <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div className="brand-icon-box">
            BP
          </div>
          <span className="brand-title">Brownie Points</span>
        </Link>
        <div className="d-none d-md-flex gap-3 ms-3">
          <a href="#how-it-works" className="text-secondary text-decoration-none small fw-medium">
            How It Works
          </a>
          <a href="#recognition" className="text-secondary text-decoration-none small fw-medium">
            Recognition
          </a>
          <a href="#experience" className="text-secondary text-decoration-none small fw-medium">
            Employee Experience
          </a>
          <a href="#benefits" className="text-secondary text-decoration-none small fw-medium">
            Enterprise Benefits
          </a>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        {user ? (
          <div className="d-flex align-items-center gap-3">
            <span className="small text-muted d-none d-sm-inline">
              {user.firstName} ({user.role})
            </span>
            <Link href={getDashboardLink()} className="btn btn-sm btn-outline-primary">
              <i className="bi bi-grid-fill me-1"></i> Dashboard
            </Link>
            <button onClick={logout} className="btn btn-sm btn-outline-secondary">
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-sm btn-primary px-3">
            Sign In to Portal <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
