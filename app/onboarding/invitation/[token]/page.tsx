'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { OnboardingWizard } from '../../../../components/onboarding/OnboardingWizard';
import api from '../../../../lib/api';

interface InvitationDetails {
  email: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  status: string;
  expiresAt: string;
}

export default function InvitationAcceptancePage() {
  const params = useParams();
  const router = useRouter();
  const rawToken = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!rawToken) return;

    const validateToken = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get(`/onboarding/invitation/${rawToken}`);
        if (res.data.success) {
          setInvitation(res.data.data);
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            'This invitation link is invalid or has expired. Please contact your HR Manager for a new link.'
        );
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [rawToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setValidationError('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[a-z]/.test(password)) {
      setValidationError('Password must contain at least one lowercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setValidationError('Password must contain at least one number.');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/onboarding/invitation/accept', {
        token: rawToken,
        password,
      });

      if (res.data.success) {
        const { token: jwtToken, user } = res.data.data;
        if (jwtToken) {
          localStorage.setItem('bp_token', jwtToken);
        }
        if (user) {
          localStorage.setItem('bp_user', JSON.stringify(user));
        }
        router.push('/onboarding/profile');
      }
    } catch (err: any) {
      setValidationError(err.response?.data?.message || 'Failed to activate account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center justify-content-center p-2 mb-2 bg-primary text-white rounded">
            <i className="bi bi-award-fill fs-4"></i>
          </div>
          <h3 className="fw-bold text-dark mb-1">Brownie Points</h3>
          <p className="text-muted small">Enterprise Employee Recognition &amp; Purpose Alignment</p>
        </div>

        {/* Stepper */}
        <OnboardingWizard currentStep={1} />

        {loading ? (
          <div className="enterprise-card p-5 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Validating Invitation...</span>
            </div>
            <p className="text-muted small fw-semibold">Validating enterprise invitation token...</p>
          </div>
        ) : error ? (
          <div className="enterprise-card p-4 p-md-5">
            <div className="text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger mb-3"
                style={{ width: '64px', height: '64px' }}
              >
                <i className="bi bi-shield-x fs-2"></i>
              </div>
              <h5 className="fw-bold text-dark mb-2">Invitation Expired or Invalid</h5>
              <p className="text-muted small mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
                {error}
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Link href="/login" className="btn btn-outline-secondary btn-sm">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Return to Login
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="enterprise-card">
            <div className="enterprise-card-header">
              <span className="fw-bold">Step 1: Activate Your Corporate Account</span>
            </div>
            <div className="p-4 p-md-5">
              <div className="alert alert-light border py-3 px-3 mb-4 small">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                      Organization
                    </span>
                    <strong className="text-dark">{invitation?.organizationName}</strong>
                  </div>
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                      Invited Recipient
                    </span>
                    <strong className="text-dark">
                      {invitation?.firstName} {invitation?.lastName} ({invitation?.email})
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                      Token Status
                    </span>
                    <span className="badge bg-success-subtle text-success border border-success-subtle">
                      Single-Use Valid
                    </span>
                  </div>
                </div>
              </div>

              {validationError && (
                <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {validationError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted text-uppercase">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    className="form-control bg-light"
                    value={invitation?.email || ''}
                    disabled
                    readOnly
                  />
                  <div className="form-text" style={{ fontSize: '0.75rem' }}>
                    Email is pre-verified and linked to your corporate profile.
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted text-uppercase">
                      Set Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-semibold text-muted text-uppercase">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-type password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-light border mb-4">
                  <span className="d-block small fw-bold text-dark mb-2">Password Requirements:</span>
                  <ul className="list-unstyled mb-0 small text-muted" style={{ fontSize: '0.8rem' }}>
                    <li className="d-flex align-items-center gap-2 mb-1">
                      <i
                        className={`bi ${
                          password.length >= 8 ? 'bi-check-circle-fill text-success' : 'bi-circle text-secondary'
                        }`}
                      ></i>
                      At least 8 characters long
                    </li>
                    <li className="d-flex align-items-center gap-2 mb-1">
                      <i
                        className={`bi ${
                          /[A-Z]/.test(password) && /[a-z]/.test(password)
                            ? 'bi-check-circle-fill text-success'
                            : 'bi-circle text-secondary'
                        }`}
                      ></i>
                      Combination of uppercase and lowercase letters
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <i
                        className={`bi ${
                          /[0-9]/.test(password) ? 'bi-check-circle-fill text-success' : 'bi-circle text-secondary'
                        }`}
                      ></i>
                      At least one number
                    </li>
                  </ul>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Activating Account...
                      </>
                    ) : (
                      <>
                        Activate Account &amp; Continue <i className="bi bi-arrow-right ms-1"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
