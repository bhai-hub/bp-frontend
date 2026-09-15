'use client';

import React from 'react';
import ErrorPage from './ErrorPage';
import { useAuth } from '../../context/AuthContext';

interface ForbiddenErrorProps {
  customMessage?: string;
  requiredSection?: string;
}

export const ForbiddenError: React.FC<ForbiddenErrorProps> = ({
  customMessage,
  requiredSection,
}) => {
  const { user } = useAuth();

  const getDashboardAction = () => {
    if (!user) {
      return {
        label: 'Sign In',
        href: '/login',
        icon: 'bi-box-arrow-in-right',
        variant: 'primary' as const,
      };
    }

    switch (user.role) {
      case 'SUPER_ADMIN':
        return {
          label: 'Return to Admin Dashboard',
          href: '/admin',
          icon: 'bi-speedometer2',
          variant: 'primary' as const,
        };
      case 'HR_MANAGER':
        return {
          label: 'Return to HR Dashboard',
          href: '/hr',
          icon: 'bi-briefcase',
          variant: 'primary' as const,
        };
      case 'EMPLOYEE':
        return {
          label: 'Return to Employee Dashboard',
          href: '/employee',
          icon: 'bi-person',
          variant: 'primary' as const,
        };
      default:
        return {
          label: 'Return to Dashboard',
          href: '/',
          icon: 'bi-house',
          variant: 'primary' as const,
        };
    }
  };

  const roleNotice = user
    ? `Your current account (${user.role.replace('_', ' ')}) does not have access to ${
        requiredSection ? `the ${requiredSection} section` : 'this section'
      }.`
    : undefined;

  return (
    <ErrorPage
      statusCode={403}
      title="Access restricted"
      message={
        customMessage ||
        "You don't have permission to access this resource. Please contact your system administrator if you believe this is in error."
      }
      icon="bi-shield-lock"
      iconVariant="warning"
      roleNotice={roleNotice}
      primaryAction={getDashboardAction()}
      secondaryAction={{
        label: 'Go to Home',
        href: '/',
        icon: 'bi-house',
        variant: 'outline-secondary',
      }}
    />
  );
};

export default ForbiddenError;
