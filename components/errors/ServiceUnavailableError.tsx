'use client';

import React from 'react';
import ErrorPage from './ErrorPage';

interface ServiceUnavailableErrorProps {
  onRetry?: () => void;
  customMessage?: string;
  retryAfterSeconds?: number;
}

export const ServiceUnavailableError: React.FC<ServiceUnavailableErrorProps> = ({
  onRetry,
  customMessage,
}) => {
  return (
    <ErrorPage
      statusCode={503}
      title="Service temporarily unavailable"
      message={
        customMessage ||
        'Brownie Points is temporarily undergoing scheduled maintenance or experiencing momentary service limits. Please try again shortly.'
      }
      icon="bi-cloud-slash"
      iconVariant="warning"
      showRetry={true}
      onRetry={onRetry || (() => window.location.reload())}
      primaryAction={{
        label: 'Try Again',
        onClick: onRetry || (() => window.location.reload()),
        icon: 'bi-arrow-clockwise',
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

export default ServiceUnavailableError;
