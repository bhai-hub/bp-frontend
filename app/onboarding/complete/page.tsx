'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import { OnboardingWizard } from '../../../components/onboarding/OnboardingWizard';

export default function OnboardingCompletePage() {
  const { user } = useAuth();

  return (
    <main id="main-content" tabIndex={-1} className="min-vh-100 py-5" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-2 mb-2 bg-primary text-white rounded" aria-hidden="true">
            <i className="bi bi-award-fill fs-4"></i>
          </div>
          <h1 className="fw-bold text-dark mb-1 fs-3">Brownie Points</h1>
          <p className="text-muted small">Employee Onboarding Completed</p>
        </div>

        {/* Stepper */}
        <OnboardingWizard currentStep={4} />

        <div className="enterprise-card text-center p-5">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success mb-3"
            style={{ width: '72px', height: '72px' }}
          >
            <i className="bi bi-check-circle-fill fs-1"></i>
          </div>

          <h4 className="fw-bold text-dark mb-2">Welcome to the Team, {user?.firstName}!</h4>
          <p className="text-muted small mb-4" style={{ maxWidth: '540px', margin: '0 auto' }}>
            Your enterprise account is fully activated. Your employee profile is verified, your Ikigai reflections are recorded, and your corporate Brownie Points wallet is ready.
          </p>

          <div className="row g-3 text-start mb-4" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="col-sm-6">
              <div className="p-3 bg-light border h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-person-check-fill text-primary"></i>
                  <strong className="small text-dark">Verified Identity</strong>
                </div>
                <p className="small text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                  {user?.employee?.designation} &bull; {user?.employee?.department}
                  <br />
                  Code: <code>{user?.employee?.employeeCode}</code>
                </p>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 bg-light border h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-wallet2 text-success"></i>
                  <strong className="small text-dark">Corporate BP Wallet</strong>
                </div>
                <p className="small text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                  Spendable &amp; Loyalty sub-wallets initialized and ready for peer recognition.
                </p>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 bg-light border h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-compass text-danger"></i>
                  <strong className="small text-dark">Ikigai Alignment</strong>
                </div>
                <p className="small text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                  4-dimension reflections saved securely. You can review or update them anytime.
                </p>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-3 bg-light border h-100">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-shield-check text-warning"></i>
                  <strong className="small text-dark">Enterprise Compliance</strong>
                </div>
                <p className="small text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                  Full jurisdiction policy safeguards enabled for your organization.
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <Link href="/employee" className="btn btn-primary px-4 py-2">
              <i className="bi bi-speedometer2 me-2" aria-hidden="true"></i> Launch Employee Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
