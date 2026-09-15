'use client';

import React from 'react';
import ServerError from '../../components/errors/ServerError';

export default function ServerErrorPage() {
  return (
    <ServerError
      onRetry={() => window.location.reload()}
      customMessage="We couldn't complete your request due to an internal server issue. Please try again or return to your dashboard."
    />
  );
}
