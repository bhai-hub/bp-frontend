import React from 'react';
import UnauthorizedError from '../../components/errors/UnauthorizedError';

export const metadata = {
  title: '401 - Authentication Required | Brownie Points',
  description: 'Authentication is required to access this resource.',
};

export default function UnauthorizedPage() {
  return <UnauthorizedError />;
}
