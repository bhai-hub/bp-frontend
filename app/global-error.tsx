'use client';

import React, { useEffect } from 'react';
import ServerError from '../components/errors/ServerError';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical root error in global-error boundary:', {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Application Error | Brownie Points</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body style={{ backgroundColor: '#f8fafc', margin: 0, padding: 0 }}>
        <ServerError
          onRetry={reset}
          supportId={error.digest}
          customMessage="A critical application error occurred. We apologize for the inconvenience. Please try again or return to home."
        />
      </body>
    </html>
  );
}
