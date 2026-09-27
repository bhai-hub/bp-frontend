import React from 'react';
import InvitationAcceptancePage from './InvitationClient';

export function generateStaticParams() {
  return [{ token: 'default' }];
}

export default function Page({ params }: { params: { token: string } }) {
  return <InvitationAcceptancePage initialToken={params?.token} />;
}
