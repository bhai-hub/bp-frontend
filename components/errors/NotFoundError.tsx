'use client';

import React from 'react';
import ErrorPage from './ErrorPage';

interface NotFoundErrorProps {
  customMessage?: string;
}

export const NotFoundError: React.FC<NotFoundErrorProps> = ({ customMessage }) => {
  return (
    <ErrorPage
      statusCode={404}
      title="Page not found"
      message={customMessage || "The page you're looking for doesn't exist or may have been moved."}
      icon="bi-search"
      iconVariant="default"
      primaryAction={{
        label: 'Back to Dashboard',
        href: '/', // Will be role-resolved or link to /
        icon: 'bi-grid-fill',
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

export default NotFoundError;
