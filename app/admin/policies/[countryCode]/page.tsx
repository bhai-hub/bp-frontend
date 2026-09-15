'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '../../../../components/DashboardLayout';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import api from '../../../../lib/api';
import { JurisdictionPolicy } from '../../../../types';

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const countryCode = (params.countryCode as string)?.toUpperCase();

  const [policy, setPolicy] = useState<JurisdictionPolicy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    status: 'CONFIGURED',
    leaderboardEnabled: true,
    publicProfileEnabled: true,
    portabilityEnabled: true,
    redemptionEnabled: true,
    nonCashRedemptionOnly: true,
    automatedDecisionEnabled: false,
    humanReviewRequired: false,
    consentRequired: false,
    dataLocationPolicy: 'GLOBAL',
    retentionPolicy: 'STANDARD',
    description: '',
    reason: '',
  });

  const fetchPolicy = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/admin/policies/${countryCode}`);
      if (res.data.success) {
        const p: JurisdictionPolicy = res.data.data;
        setPolicy(p);
        setFormData({
          status: p.status || 'CONFIGURED',
          leaderboardEnabled: p.leaderboardEnabled,
          publicProfileEnabled: p.publicProfileEnabled,
          portabilityEnabled: p.portabilityEnabled,
          redemptionEnabled: p.redemptionEnabled,
          nonCashRedemptionOnly: p.nonCashRedemptionOnly,
          automatedDecisionEnabled: p.automatedDecisionEnabled,
          humanReviewRequired: p.humanReviewRequired,
          consentRequired: p.consentRequired,
          dataLocationPolicy: p.dataLocationPolicy || 'GLOBAL',
          retentionPolicy: p.retentionPolicy || 'STANDARD',
          description: p.description || '',
          reason: '',
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load policy profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (countryCode) {
      fetchPolicy();
    }
  }, [countryCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;

    if (!formData.reason.trim()) {
      setError('An audit reason is required for updating jurisdiction policy governance');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.patch(`/admin/policies/${policy.id}`, formData);
      if (res.data.success) {
        setSuccess(`Jurisdiction policy for ${countryCode} updated successfully.`);
        setPolicy(res.data.data);
        setFormData((prev) => ({ ...prev, reason: '' }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update policy');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
        {/* Back Link & Header */}
        <div className="mb-4">
          <Link href="/admin/policies" className="text-decoration-none small text-muted mb-2 d-inline-block">
            <i className="bi bi-arrow-left me-1"></i> Back to Jurisdiction Policies
          </Link>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold text-dark mb-0">
                  {policy?.country?.name || countryCode} Policy Configuration
                </h4>
                <span className="badge bg-light text-dark border font-monospace px-2 py-1">
                  {countryCode}
                </span>
                {policy && (
                  <span className="badge bg-secondary">
                    v{policy.policyVersion}
                  </span>
                )}
                {policy && (
                  <span
                    className={`badge ${
                      policy.status === 'CONFIGURED'
                        ? 'bg-success text-white'
                        : 'bg-warning text-dark'
                    }`}
                  >
                    {policy.status === 'CONFIGURED'
                      ? 'Configured jurisdiction policy'
                      : 'Policy requires review'}
                  </span>
                )}
              </div>
              <p className="text-muted small mb-0 mt-1">
                Configure runtime feature switches and regulatory policy enforcement for this jurisdiction.
              </p>
            </div>
          </div>
        </div>

        {success && (
          <div className="alert alert-success py-2 px-3 small mb-4 alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i> {success}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-4 alert-dismissible fade show" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : !policy ? (
          <div className="alert alert-warning py-3">
            No policy found for jurisdiction country <code>{countryCode}</code>.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Core Policy Settings Card */}
              <div className="col-lg-8">
                <div className="enterprise-card mb-4">
                  <div className="enterprise-card-header">
                    <span>Feature Governance Switches</span>
                  </div>
                  <div className="p-4">
                    <p className="text-muted small mb-4">
                      These settings directly govern backend API middleware enforcement (e.g. <code>requireJurisdictionFeature</code>). If a feature is disabled, tenant organizations under this jurisdiction will receive HTTP 403 when invoking disabled endpoints.
                    </p>

                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="leaderboardEnabled"
                              checked={formData.leaderboardEnabled}
                              onChange={(e) =>
                                setFormData({ ...formData, leaderboardEnabled: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="leaderboardEnabled">
                              Public Leaderboards
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Allow competitive rankings and public scoreboards. Disable for works-council jurisdictions (e.g. Germany) or anti-social-scoring regulations.
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="publicProfileEnabled"
                              checked={formData.publicProfileEnabled}
                              onChange={(e) =>
                                setFormData({ ...formData, publicProfileEnabled: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="publicProfileEnabled">
                              Public Employee Profiles
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Expose employee recognition history publicly across the organization. Disable if public visibility is restricted by local labor agreements.
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="portabilityEnabled"
                              checked={formData.portabilityEnabled}
                              onChange={(e) =>
                                setFormData({ ...formData, portabilityEnabled: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="portabilityEnabled">
                              Point Portability
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Allow staff to transfer or export points upon employer separation. Prohibited under strict corporate compensation separation policies.
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="redemptionEnabled"
                              checked={formData.redemptionEnabled}
                              onChange={(e) =>
                                setFormData({ ...formData, redemptionEnabled: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="redemptionEnabled">
                              Reward Redemption
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Enable employee store and catalog rewards. Disable if points operate strictly as non-redeemable peer kudos.
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="nonCashRedemptionOnly"
                              checked={formData.nonCashRedemptionOnly}
                              onChange={(e) =>
                                setFormData({ ...formData, nonCashRedemptionOnly: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="nonCashRedemptionOnly">
                              Non-Cash Redemption Only
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Enforce gift cards, experiences, and merchandise only to avoid wage / cash-equivalent tax classification issues.
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="automatedDecisionEnabled"
                              checked={formData.automatedDecisionEnabled}
                              onChange={(e) =>
                                setFormData({ ...formData, automatedDecisionEnabled: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="automatedDecisionEnabled">
                              Automated Decision Making
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Permit autonomous algorithms to disburse points or recognize milestones without mandatory human intervention.
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="humanReviewRequired"
                              checked={formData.humanReviewRequired}
                              onChange={(e) =>
                                setFormData({ ...formData, humanReviewRequired: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="humanReviewRequired">
                              Human Review Required
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Mandate HR manager or supervisor approval for high-value recognitions and peer awards.
                          </p>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="p-3 border rounded bg-light">
                          <div className="form-check form-switch mb-2">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="consentRequired"
                              checked={formData.consentRequired}
                              onChange={(e) =>
                                setFormData({ ...formData, consentRequired: e.target.checked })
                              }
                            />
                            <label className="form-check-label fw-bold text-dark" htmlFor="consentRequired">
                              Explicit Consent Required
                            </label>
                          </div>
                          <p className="text-muted small mb-0">
                            Require affirmative employee opt-in before enrollment into recognition tracking.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Metadata & Action Card */}
              <div className="col-lg-4">
                {/* Governance Status & Storage */}
                <div className="enterprise-card mb-4">
                  <div className="enterprise-card-header">
                    <span>Data & Status Governance</span>
                  </div>
                  <div className="p-3">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Governance Status
                      </label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="CONFIGURED">Configured jurisdiction policy</option>
                        <option value="DEFAULT_REVIEW_REQUIRED">Policy requires review</option>
                      </select>
                      <small className="form-text text-muted">
                        Unreviewed policies default to restrictive review posture.
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Data Residency Zone
                      </label>
                      <select
                        className="form-select font-monospace small"
                        value={formData.dataLocationPolicy}
                        onChange={(e) => setFormData({ ...formData, dataLocationPolicy: e.target.value })}
                      >
                        <option value="GLOBAL">GLOBAL (Multi-Region Cloud)</option>
                        <option value="EU_ONLY">EU_ONLY (Frankfurt / EEA Isolated)</option>
                        <option value="IN_COUNTRY_OPTION">IN_COUNTRY_OPTION (Mumbai / India)</option>
                        <option value="LOCAL_ONLY">LOCAL_ONLY (Strict In-Country Tenant)</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Data Retention Policy
                      </label>
                      <select
                        className="form-select font-monospace small"
                        value={formData.retentionPolicy}
                        onChange={(e) => setFormData({ ...formData, retentionPolicy: e.target.value })}
                      >
                        <option value="STANDARD">STANDARD (7-year fiscal audit)</option>
                        <option value="CONFIGURABLE">CONFIGURABLE (Tenant customized)</option>
                        <option value="STRICT_PRUNING">STRICT_PRUNING (1-year recognition purge)</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Policy Description
                      </label>
                      <textarea
                        className="form-control small"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Regulatory and governance context..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Audit Sign-Off & Submit */}
                <div className="enterprise-card">
                  <div className="enterprise-card-header">
                    <span>Audit Sign-Off</span>
                  </div>
                  <div className="p-3">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Reason for Update <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control small"
                        rows={3}
                        placeholder="Document why this policy rule is being modified..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        required
                      ></textarea>
                      <small className="form-text text-muted">
                        Mandatory compliance audit trail justification.
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Saving Changes...' : 'Save Policy Configuration'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
