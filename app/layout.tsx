import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { AccessibilityProvider } from '../context/AccessibilityContext';
import { SkipLink } from '../components/SkipLink';
import { AccessibilityToolbar } from '../components/AccessibilityToolbar';

export const metadata: Metadata = {
  title: 'Brownie Points — Enterprise Employee Recognition & Rewards',
  description:
    'Authoritative enterprise currency for recognition, employee retention, performance awards, and transparent transactional Brownie Points ledgers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AccessibilityProvider>
          <SkipLink />
          <AuthProvider>{children}</AuthProvider>
          <AccessibilityToolbar />
        </AccessibilityProvider>
      </body>
    </html>
  );
}
