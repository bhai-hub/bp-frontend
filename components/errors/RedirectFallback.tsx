'use client';

import React from 'react';
import ErrorPage from './ErrorPage';

interface RedirectFallbackProps {
  targetUrl?: string;
  autoRedirect?: boolean;
  countdownSeconds?: number;
  customMessage?: string;
}

export const RedirectFallback: React.FC<RedirectFallbackProps> = ({
  targetUrl = '/',
  autoRedirect = true,
  countdownSeconds = 3,
  customMessage,
}) => {
  return (
    <ErrorPage
      statusCode={301}
      title="Redirecting..."
      message={
        customMessage ||
        'You are being redirected to the updated resource location.'
      }
      icon="bi-arrow-right-circle"
      iconVariant="info"
      autoRedirect={
        autoRedirect
          ? {
              targetUrl,
              countdownSeconds,
            }
          : undefined
      }
      primaryAction={{
        label: 'Continue Now',
        href: targetUrl,
        icon: 'bi-box-arrow-up-right',
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

export default RedirectFallback;
