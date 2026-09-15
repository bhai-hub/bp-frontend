import React from 'react';
import ForbiddenError from '../../components/errors/ForbiddenError';

export const metadata = {
  title: '403 - Access Restricted | Brownie Points',
  description: 'You do not have authorization to access this enterprise resource.',
};

export default function ForbiddenPage() {
  return <ForbiddenError />;
}
