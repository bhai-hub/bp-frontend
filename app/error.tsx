'use client';

import React, { useEffect } from 'react';
import ServerError from '../components/errors/ServerError';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected frontend runtime exception without exposing sensitive data to the DOM
    console.error('Unhandled runtime exception caught by Next.js error boundary:', {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <ServerError
      onRetry={reset}
      supportId={error.digest}
      customMessage="We couldn't complete your request due to an unexpected application error. Please try again or return to your dashboard."
    />
  );
}
