'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setChecking(false);
      return;
    }

    if (user.role !== 'EMPLOYEE') {
      setChecking(false);
      return;
    }

    // Verify onboarding status
    const checkStatus = async () => {
      try {
        const res = await api.get('/onboarding/status');
        if (res.data.success) {
          const status = res.data.data.onboardingStatus;
          if (status === 'COMPLETED') {
            setChecking(false);
            return;
          }

          if (status === 'ACCOUNT_CREATED' || status === 'PROFILE_PENDING') {
            router.replace('/onboarding/profile');
            return;
          }

          if (status === 'IKIGAI_PENDING') {
            router.replace('/onboarding/ikigai');
            return;
          }

          if (status === 'INVITED') {
            router.replace('/login');
            return;
          }

          if (status === 'SUSPENDED') {
            setChecking(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to verify onboarding status:', err);
        // Fallback to in-memory user object
        const status = user.employee?.onboardingStatus;
        if (status && status !== 'COMPLETED') {
          if (status === 'ACCOUNT_CREATED' || status === 'PROFILE_PENDING') {
            router.replace('/onboarding/profile');
            return;
          }
          if (status === 'IKIGAI_PENDING') {
            router.replace('/onboarding/ikigai');
            return;
          }
        }
        setChecking(false);
      }
    };

    checkStatus();
  }, [user, isLoading, router]);

  if (isLoading || (checking && user?.role === 'EMPLOYEE' && user.employee?.onboardingStatus !== 'COMPLETED')) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center p-4 bg-white border" style={{ maxWidth: '420px', width: '100%' }}>
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h6 className="fw-bold text-dark mb-1">Verifying Onboarding Status</h6>
          <p className="text-muted small mb-3">
            Checking your enterprise profile and Ikigai registration...
          </p>
          <div className="pt-2 border-top">
            <button onClick={logout} className="btn btn-sm btn-outline-secondary">
              <i className="bi bi-box-arrow-right me-1"></i> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingGuard;
