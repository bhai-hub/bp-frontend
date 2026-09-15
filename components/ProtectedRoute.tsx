'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleType } from '../types';
import UnauthorizedError from './errors/UnauthorizedError';
import ForbiddenError from './errors/ForbiddenError';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: RoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted small fw-semibold text-uppercase letter-spacing">
            Verifying Enterprise Credentials...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, render the enterprise 401 experience
  if (!user) {
    return <UnauthorizedError />;
  }

  // If authenticated but lacks role authorization, render the enterprise 403 experience
  if (!allowedRoles.includes(user.role)) {
    return <ForbiddenError />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
