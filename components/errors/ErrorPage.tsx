'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export interface ActionConfig {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
}

export interface ErrorPageProps {
  statusCode: number | string;
  title: string;
  message: string;
  icon?: string;
  iconVariant?: 'default' | 'warning' | 'danger' | 'info';
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  showRetry?: boolean;
  onRetry?: () => void;
  supportId?: string;
  badgeText?: string;
  roleNotice?: string;
  autoRedirect?: {
    targetUrl: string;
    countdownSeconds?: number;
  };
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  statusCode,
  title,
  message,
  icon,
  iconVariant = 'default',
  primaryAction,
  secondaryAction,
  showRetry = false,
  onRetry,
  supportId,
  badgeText,
  roleNotice,
  autoRedirect,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [countdown, setCountdown] = useState<number | null>(
    autoRedirect ? autoRedirect.countdownSeconds || 3 : null
  );

  // Determine role-aware dashboard link
  const getRoleDashboardHref = (): string => {
    if (!user) return '/';
    switch (user.role) {
      case 'SUPER_ADMIN':
        return '/admin';
      case 'HR_MANAGER':
        return '/hr';
      case 'EMPLOYEE':
        return '/employee';
      default:
        return '/';
    }
  };

  const getRoleDashboardLabel = (): string => {
    if (!user) return 'Go to Home';
    switch (user.role) {
      case 'SUPER_ADMIN':
        return 'Return to Admin Dashboard';
      case 'HR_MANAGER':
        return 'Return to HR Dashboard';
      case 'EMPLOYEE':
        return 'Return to Employee Dashboard';
      default:
        return 'Back to Dashboard';
    }
  };

  // Handle countdown redirect if enabled
  useEffect(() => {
    if (!autoRedirect || countdown === null) return;

    if (countdown <= 0) {
      router.push(autoRedirect.targetUrl);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, autoRedirect, router]);

  // Default resolved primary action
  const resolvedPrimaryAction: ActionConfig = primaryAction || {
    label: getRoleDashboardLabel(),
    href: getRoleDashboardHref(),
    icon: 'bi-house-door',
    variant: 'primary',
  };

  // Default resolved secondary action
  const resolvedSecondaryAction: ActionConfig | undefined =
    secondaryAction || (primaryAction ? {
      label: 'Go Back',
      onClick: () => router.back(),
      icon: 'bi-arrow-left',
      variant: 'outline-secondary',
    } : undefined);

  const renderActionButton = (action: ActionConfig, isPrimary: boolean) => {
    const btnClass = `btn btn-${action.variant || (isPrimary ? 'primary' : 'outline-secondary')}`;

    if (action.href) {
      return (
        <Link key={action.label} href={action.href} className={btnClass}>
          {action.icon && <i className={`bi ${action.icon} me-1.5`}></i>}
          {action.label}
        </Link>
      );
    }

    return (
      <button
        key={action.label}
        type="button"
        className={btnClass}
        onClick={action.onClick}
      >
        {action.icon && <i className={`bi ${action.icon} me-1.5`}></i>}
        {action.label}
      </button>
    );
  };

  return (
    <main className="error-page-wrapper" role="main">
      <div className="error-card">
        {/* Subtle Brand Header */}
        <Link href="/" className="error-brand-header" title="Brownie Points Home">
          <div className="error-brand-mark">BP</div>
          <span className="error-brand-name">Brownie Points</span>
        </Link>

        {/* Large Typographic Status Code */}
        <div className="error-status-code" aria-hidden="true">
          {statusCode}
        </div>

        {/* Icon / Visual Container */}
        {icon && (
          <div className={`error-icon-box ${iconVariant !== 'default' ? `icon-${iconVariant}` : ''}`} aria-hidden="true">
            <i className={`bi ${icon}`}></i>
          </div>
        )}

        {/* Badge if supplied */}
        {badgeText && (
          <div className="mb-2">
            <span className="badge bg-light text-dark border px-2 py-1 small">
              {badgeText}
            </span>
          </div>
        )}

        {/* Semantic Title */}
        <h1 className="error-title">{title}</h1>

        {/* Description Message */}
        <p className="error-message">{message}</p>

        {/* Role Notice */}
        {roleNotice && (
          <div className="error-role-notice">
            <i className="bi bi-info-circle me-1 text-secondary"></i>
            {roleNotice}
          </div>
        )}

        {/* Countdown Indicator for Redirects */}
        {countdown !== null && countdown > 0 && autoRedirect && (
          <div className="small text-muted mb-3">
            <i className="bi bi-arrow-repeat me-1 text-primary"></i>
            Redirecting in {countdown} {countdown === 1 ? 'second' : 'seconds'}...
          </div>
        )}

        {/* Action Buttons */}
        <div className="error-actions">
          {showRetry && onRetry && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onRetry}
            >
              <i className="bi bi-arrow-clockwise me-1.5"></i>
              Try Again
            </button>
          )}

          {renderActionButton(resolvedPrimaryAction, true)}

          {resolvedSecondaryAction && renderActionButton(resolvedSecondaryAction, false)}
        </div>

        {/* Footer Support Information */}
        <footer className="error-footer">
          {supportId && (
            <div>
              Support Reference: <span className="error-reference-code">{supportId}</span>
            </div>
          )}
          <span>Brownie Points Enterprise Recognition Platform</span>
        </footer>
      </div>
    </main>
  );
};

export default ErrorPage;
