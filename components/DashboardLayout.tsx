'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { RoleType } from '../types';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles: RoleType[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, allowedRoles }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    if (user.role === 'SUPER_ADMIN') {
      return [
        { label: 'Dashboard', href: '/admin', icon: 'bi-grid-1x2' },
        { label: 'Organizations', href: '/admin/organizations', icon: 'bi-building' },
        { label: 'HR Managers', href: '/admin/hr-managers', icon: 'bi-people' },
        { label: 'Jurisdiction Policies', href: '/admin/policies', icon: 'bi-sliders' },
        { label: 'Audit Log', href: '/admin#audit', icon: 'bi-shield-check' },
      ];
    }

    if (user.role === 'HR_MANAGER') {
      return [
        { label: 'Dashboard', href: '/hr', icon: 'bi-grid-1x2' },
        { label: 'Employees', href: '/hr/employees', icon: 'bi-people' },
        { label: 'BP Activity', href: '/hr/bp-activity', icon: 'bi-journal-text' },
        { label: 'Organization', href: '/hr/organization', icon: 'bi-building' },
      ];
    }

    // EMPLOYEE
    return [
      { label: 'Dashboard', href: '/employee', icon: 'bi-speedometer2' },
      { label: 'My BP Wallet', href: '/employee/my-bp', icon: 'bi-wallet2' },
      { label: 'Activity History', href: '/employee/activity', icon: 'bi-clock-history' },
      { label: 'My Profile', href: '/employee/profile', icon: 'bi-person-badge' },
    ];
  };

  const navItems = getNavItems();

  const getPortalTitle = () => {
    if (user?.role === 'SUPER_ADMIN') return 'Super Admin Portal';
    if (user?.role === 'HR_MANAGER') return 'HR Operations Portal';
    return 'Employee Portal';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="p-3 border-bottom d-flex align-items-center gap-2">
          <div className="brand-icon-box">
            BP
          </div>
          <div>
            <div className="fw-bold fs-6 text-dark lh-1">Brownie Points</div>
            <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
              {getPortalTitle()}
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="py-3 flex-grow-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <i className={`bi ${item.icon} fs-5`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="p-3 border-top bg-light">
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-truncate me-2">
              <div className="fw-semibold text-dark text-truncate small">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-muted small text-truncate" style={{ fontSize: '0.72rem' }}>
                {user?.email}
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-sm btn-outline-danger p-1 px-2"
              title="Sign Out"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="dashboard-main">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="d-flex align-items-center gap-3">
            <span className="fw-semibold text-secondary small text-uppercase letter-spacing">
              {user?.organization ? user.organization.name : 'System Platform'}
            </span>
            {user?.role && (
              <span className="enterprise-badge enterprise-badge-blue">
                {user.role.replace('_', ' ')}
              </span>
            )}
          </div>

          <div className="d-flex align-items-center gap-3">
            <Link href="/" className="btn btn-sm btn-outline-secondary" target="_blank">
              <i className="bi bi-globe me-1"></i> Public Site
            </Link>
            <a
              href="http://localhost:5000/api/docs"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline-secondary"
            >
              <i className="bi bi-code-slash me-1"></i> Swagger API
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
