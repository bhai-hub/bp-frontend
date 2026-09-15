'use client';

import React from 'react';
import ErrorPage from './ErrorPage';

interface UnauthorizedErrorProps {
  redirectUrl?: string;
  customMessage?: string;
}

export const UnauthorizedError: React.FC<UnauthorizedErrorProps> = ({
  redirectUrl,
  customMessage,
}) => {
  const loginHref = redirectUrl ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : '/login';

  return (
    <ErrorPage
      statusCode={401}
      title="Authentication required"
      message={customMessage || 'Please sign in to continue.'}
      icon="bi-person-lock"
      iconVariant="info"
      primaryAction={{
        label: 'Sign In',
        href: loginHref,
        icon: 'bi-box-arrow-in-right',
        variant: 'primary',
      }}
      secondaryAction={{
        label: 'Go to Home',
        href: '/',
        icon: 'bi-house',
        variant: 'outline-secondary',
      }}
    />
  );
};

export default UnauthorizedError;
