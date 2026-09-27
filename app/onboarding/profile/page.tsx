'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { OnboardingWizard } from '../../../components/onboarding/OnboardingWizard';
import api from '../../../lib/api';

export default function OnboardingProfilePage() {
  const { user, isLoading, refreshUser, logout } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    designation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        department: user.employee?.department || '',
        designation: user.employee?.designation || '',
      });
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.post('/onboarding/profile', formData);
      if (res.data.success) {
        await refreshUser();
        router.push('/onboarding/ikigai');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-vh-100 py-5" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header & Signout */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 bg-primary text-white rounded" aria-hidden="true">
              <i className="bi bi-award-fill fs-5"></i>
            </div>
            <div>
              <h1 className="fw-bold text-dark mb-0 fs-5">Brownie Points</h1>
              <span className="text-muted small">Employee Onboarding</span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="btn btn-outline-secondary btn-sm"
            aria-label="Sign out of onboarding session"
          >
            <i className="bi bi-box-arrow-right me-1" aria-hidden="true"></i> Sign Out
          </button>
        </div>

        {/* Stepper */}
        <OnboardingWizard currentStep={2} />

        <div className="enterprise-card">
          <div className="enterprise-card-header d-flex justify-content-between align-items-center">
            <span className="fw-bold">Step 2: Confirm Employee Profile Details</span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
              ID: {user?.employee?.employeeCode || 'PENDING'}
            </span>
          </div>

          <div className="p-4 p-md-5">
            <p className="text-muted small mb-4">
              Please verify and finalize your enterprise profile details. This information identifies your recognition awards and internal career milestone tracking.
            </p>

            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-4" role="alert" aria-live="assertive">
                <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="profile-first-name" className="form-label small fw-semibold text-muted text-uppercase">
                    First Name <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="profile-first-name"
                    type="text"
                    className="form-control"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="profile-last-name" className="form-label small fw-semibold text-muted text-uppercase">
                    Last Name <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="profile-last-name"
                    type="text"
                    className="form-control"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="profile-corp-email" className="form-label small fw-semibold text-muted text-uppercase">
                  Corporate Email
                </label>
                <input
                  id="profile-corp-email"
                  type="email"
                  className="form-control bg-light"
                  value={user?.email || ''}
                  disabled
                  readOnly
                />
                <div className="form-text" style={{ fontSize: '0.75rem' }}>
                  Managed by your organization administrator.
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label htmlFor="profile-department" className="form-label small fw-semibold text-muted text-uppercase">
                    Department <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="profile-department"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Engineering, Sales, Operations"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="profile-designation" className="form-label small fw-semibold text-muted text-uppercase">
                    Designation / Title <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="profile-designation"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="p-3 bg-light border mb-4">
                <div className="d-flex align-items-start gap-2">
                  <i className="bi bi-shield-check text-primary fs-5 mt-1" aria-hidden="true"></i>
                  <div className="small text-muted">
                    <strong className="text-dark d-block">Corporate Wallet Initialization</strong>
                    Your employee Brownie Points wallet will be registered under this profile. Spendable and loyalty point allocations will reflect this verified identity.
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving Profile...
                    </>
                  ) : (
                    <>
                      Confirm &amp; Proceed to Ikigai Reflections <i className="bi bi-arrow-right ms-1" aria-hidden="true"></i>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
