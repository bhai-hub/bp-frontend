import React from 'react';
import OrganizationDetailPage from './OrganizationDetailClient';

export function generateStaticParams() {
  return [{ id: 'default' }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <OrganizationDetailPage initialId={params?.id} />;
}
