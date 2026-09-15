'use client';

import React from 'react';
import RedirectFallback from '../../components/errors/RedirectFallback';

export default function RedirectPage() {
  return (
    <RedirectFallback
      targetUrl="/"
      autoRedirect={false} // Allow user to inspect or click "Continue Now"
      customMessage="You are accessing an updated route and will be redirected to the platform home."
    />
  );
}
