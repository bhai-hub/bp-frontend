'use client';

import React from 'react';
import ErrorPage from './ErrorPage';

interface ServerErrorProps {
  onRetry?: () => void;
  supportId?: string;
  customMessage?: string;
}

export const ServerError: React.FC<ServerErrorProps> = ({
  onRetry,
  supportId,
  customMessage,
}) => {
  // Generate a clean support reference code if not provided
  const refCode = supportId || `BP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  return (
    <ErrorPage
      statusCode={500}
      title="Something went wrong"
      message={
        customMessage ||
        "We couldn't complete your request. Our technical team has been notified. Please try again or return to your dashboard."
      }
      icon="bi-exclamation-triangle"
      iconVariant="danger"
      showRetry={Boolean(onRetry)}
      onRetry={onRetry}
      supportId={refCode}
      primaryAction={
        onRetry
          ? undefined
          : {
              label: 'Go to Dashboard',
              href: '/',
              icon: 'bi-grid-fill',
              variant: 'primary',
            }
      }
      secondaryAction={{
        label: 'Go to Home',
        href: '/',
        icon: 'bi-house',
        variant: 'outline-secondary',
      }}
    />
  );
};

export default ServerError;
