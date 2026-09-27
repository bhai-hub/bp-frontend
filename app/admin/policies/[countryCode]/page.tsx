import React from 'react';
import PolicyDetailPage from './PolicyDetailClient';

export function generateStaticParams() {
  return [
    { countryCode: 'default' },
    { countryCode: 'US' },
    { countryCode: 'IN' },
    { countryCode: 'DE' },
    { countryCode: 'CN' },
    { countryCode: 'GB' },
  ];
}

export default function Page({ params }: { params: { countryCode: string } }) {
  return <PolicyDetailPage initialCountryCode={params?.countryCode} />;
}
