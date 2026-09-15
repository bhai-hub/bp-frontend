'use client';

import React from 'react';
import ServiceUnavailableError from '../../components/errors/ServiceUnavailableError';

export default function ServiceUnavailablePage() {
  return (
    <ServiceUnavailableError
      onRetry={() => window.location.reload()}
      customMessage="Brownie Points is temporarily undergoing system maintenance or experiencing peak service demand. Please try again in a few moments."
    />
  );
}
