import React from 'react';
import NotFoundError from '../components/errors/NotFoundError';

export const metadata = {
  title: '404 - Page Not Found | Brownie Points',
  description: 'The requested page could not be found on the Brownie Points enterprise platform.',
};

export default function NotFound() {
  return <NotFoundError />;
}
