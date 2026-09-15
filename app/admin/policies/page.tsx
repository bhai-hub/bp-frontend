'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StatCard from '../../../components/StatCard';
import api from '../../../lib/api';
import { JurisdictionPolicy, Country } from '../../../types';

export default function JurisdictionPoliciesPage() {
  const [policies, setPolicies] = useState<JurisdictionPolicy[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Quick View Modal
  const [selectedPolicy, setSelectedPolicy] = useState<JurisdictionPolicy | null>(null);

  // Create Policy Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    countryCode: '',
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
  });
  const [creatingPolicy, setCreatingPolicy] = useState(false);

  const fetchPolicies = async () => {
    try {
      setIsLoading(true);
      const [policiesRes, countriesRes] = await Promise.all([
        api.get('/admin/policies'),
        api.get('/countries'),
      ]);

      if (policiesRes.data.success) {
        setPolicies(policiesRes.data.data);
      }
      if (countriesRes.data.success) {
        setCountries(countriesRes.data.data);
        if (countriesRes.data.data.length > 0 && !createForm.countryCode) {
          setCreateForm((prev) => ({ ...prev, countryCode: countriesRes.data.data[0].code }));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load jurisdiction policies');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleCreatePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingPolicy(true);
    setError(null);

    try {
      const res = await api.post('/admin/policies', createForm);
      if (res.data.success) {
        setSuccess(`Jurisdiction policy profile created for ${createForm.countryCode}`);
        setShowCreateModal(false);
        fetchPolicies();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create policy profile');
    } finally {
      setCreatingPolicy(false);
    }
  };

  const filteredPolicies = policies.filter((p) => {
    const matchesSearch =
      (p.country?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.countryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'CONFIGURED' && p.status === 'CONFIGURED') ||
      (statusFilter === 'REVIEW' && p.status !== 'CONFIGURED');

    return matchesSearch && matchesStatus;
  });

  const totalPolicies = policies.length;
  const configuredCount = policies.filter((p) => p.status === 'CONFIGURED').length;
  const reviewRequiredCount = policies.filter((p) => p.status !== 'CONFIGURED').length;
  const totalCoveredOrgs = policies.reduce((acc, p) => acc + (p._count?.organizations || 0), 0);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
        {/* Page Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold text-dark mb-0">Jurisdiction Policy Governance</h4>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                Enterprise Rules
              </span>
            </div>
            <p className="text-muted small mb-0 mt-1">
              Configure country-specific governance rules and feature toggles across international tenant deployments.
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary btn-sm"
            >
              <i className="bi bi-plus-circle me-1"></i> New Policy Profile
            </button>
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

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <StatCard
              label="Reference Policies"
              value={totalPolicies.toString()}
              icon="bi-shield-check"
              subtext="Country jurisdiction profiles"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              label="Configured Policies"
              value={configuredCount.toString()}
              icon="bi-check2-circle"
              badge={{ text: 'Operational', variant: 'success' }}
              subtext="Active country governance rules"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              label="Review Required"
              value={reviewRequiredCount.toString()}
              icon="bi-exclamation-triangle"
              badge={{ text: reviewRequiredCount > 0 ? 'Action Needed' : 'None', variant: reviewRequiredCount > 0 ? 'warning' : 'info' }}
              subtext="Fallback / unreviewed profiles"
            />
          </div>
          <div className="col-md-3">
            <StatCard
              label="Covered Organizations"
              value={totalCoveredOrgs.toString()}
              icon="bi-building"
              subtext="Mapped tenant organizations"
            />
          </div>
        </div>

        {/* Filters & Search */}
        <div className="enterprise-card mb-4">
          <div className="p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '400px' }}>
              <div className="input-group input-group-sm">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by country, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <span className="text-muted small">Status:</span>
              <div className="btn-group btn-group-sm">
                <button
                  type="button"
                  className={`btn ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setStatusFilter('ALL')}
                >
                  All ({policies.length})
                </button>
                <button
                  type="button"
                  className={`btn ${statusFilter === 'CONFIGURED' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setStatusFilter('CONFIGURED')}
                >
                  Configured ({configuredCount})
                </button>
                <button
                  type="button"
                  className={`btn ${statusFilter === 'REVIEW' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setStatusFilter('REVIEW')}
                >
                  Requires Review ({reviewRequiredCount})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Policies Table */}
        <div className="enterprise-card">
          <div className="enterprise-card-header d-flex justify-content-between align-items-center">
            <span>Jurisdiction Governance Profiles</span>
            <span className="text-muted small">Showing {filteredPolicies.length} of {policies.length} profiles</span>
          </div>

          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Country & Code</th>
                  <th>Version</th>
                  <th>Governance Status</th>
                  <th>Feature Rules Summary</th>
                  <th>Data Residency</th>
                  <th>Orgs</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted">
                      No jurisdiction policies match the current filter.
                    </td>
                  </tr>
                ) : (
                  filteredPolicies.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-light text-dark border px-2 py-1 font-monospace fw-bold">
                            {p.countryCode}
                          </span>
                          <div>
                            <span className="fw-semibold text-dark d-block">
                              {p.country?.name || p.countryCode}
                            </span>
                            <small className="text-muted text-truncate d-inline-block" style={{ maxWidth: '240px' }}>
                              {p.description || 'No description recorded'}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-secondary">v{p.policyVersion}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            p.status === 'CONFIGURED'
                              ? 'bg-success text-white'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {p.status === 'CONFIGURED'
                            ? 'Configured jurisdiction policy'
                            : 'Policy requires review'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1 flex-wrap">
                          <span
                            className={`badge ${
                              p.leaderboardEnabled
                                ? 'bg-success-subtle text-success border border-success-subtle'
                                : 'bg-danger-subtle text-danger border border-danger-subtle'
                            }`}
                            title={p.leaderboardEnabled ? 'Leaderboards Enabled' : 'Leaderboards Disabled'}
                          >
                            <i className={`bi ${p.leaderboardEnabled ? 'bi-check' : 'bi-x'} me-1`}></i>
                            Leaderboard
                          </span>
                          <span
                            className={`badge ${
                              p.publicProfileEnabled
                                ? 'bg-success-subtle text-success border border-success-subtle'
                                : 'bg-danger-subtle text-danger border border-danger-subtle'
                            }`}
                            title={p.publicProfileEnabled ? 'Public Profiles Enabled' : 'Public Profiles Disabled'}
                          >
                            <i className={`bi ${p.publicProfileEnabled ? 'bi-check' : 'bi-x'} me-1`}></i>
                            Profiles
                          </span>
                          <span
                            className={`badge ${
                              p.humanReviewRequired
                                ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                                : 'bg-info-subtle text-info border border-info-subtle'
                            }`}
                            title={p.humanReviewRequired ? 'Human Review Required' : 'Automated Review Permitted'}
                          >
                            <i className="bi bi-person-check me-1"></i>
                            {p.humanReviewRequired ? 'Review Req.' : 'Auto'}
                          </span>
                          <span
                            className={`badge ${
                              p.consentRequired
                                ? 'bg-primary-subtle text-primary border border-primary-subtle'
                                : 'bg-light text-muted border'
                            }`}
                            title={p.consentRequired ? 'Explicit Consent Required' : 'Default Contract'}
                          >
                            Consent
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border font-monospace">
                          {p.dataLocationPolicy}
                        </span>
                      </td>
                      <td>
                        <span className="fw-semibold text-dark">
                          {p._count?.organizations || 0}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => setSelectedPolicy(p)}
                            className="btn btn-outline-secondary"
                            title="Inspect Feature Rules"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <Link
                            href={`/admin/policies/${p.countryCode}`}
                            className="btn btn-outline-primary"
                            title="Configure Policy"
                          >
                            <i className="bi bi-gear me-1"></i> Configure
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick View Policy Modal */}
        {selectedPolicy && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="modal-title fw-bold mb-0">
                      Policy Profile: {selectedPolicy.country?.name || selectedPolicy.countryCode} ({selectedPolicy.countryCode})
                    </h6>
                    <span className="badge bg-secondary">v{selectedPolicy.policyVersion}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedPolicy(null)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="text-muted small d-block">Governance Status</span>
                      <span
                        className={`badge ${
                          selectedPolicy.status === 'CONFIGURED'
                            ? 'bg-success text-white'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {selectedPolicy.status === 'CONFIGURED'
                          ? 'Configured jurisdiction policy'
                          : 'Policy requires review'}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="text-muted small d-block">Tenants Governed</span>
                      <span className="fw-bold text-dark">
                        {selectedPolicy._count?.organizations || 0} Organizations
                      </span>
                    </div>
                  </div>

                  {selectedPolicy.description && (
                    <div className="p-3 bg-light rounded border mb-4">
                      <div className="text-muted small fw-semibold mb-1">Operational Policy Summary</div>
                      <div className="small text-dark">{selectedPolicy.description}</div>
                    </div>
                  )}

                  <h6 className="fw-bold text-dark small text-uppercase mb-3">
                    Configured Governance Switches
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle mb-0">
                      <thead className="table-light small">
                        <tr>
                          <th>Governance Dimension</th>
                          <th>Status</th>
                          <th>System Behavior</th>
                        </tr>
                      </thead>
                      <tbody className="small">
                        <tr>
                          <td className="fw-semibold">Leaderboard System</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.leaderboardEnabled ? 'bg-success text-white' : 'bg-danger text-white'
                              }`}
                            >
                              {selectedPolicy.leaderboardEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.leaderboardEnabled
                              ? 'Public leaderboards accessible by staff'
                              : 'Leaderboards restricted by policy (e.g. works council rules)'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Public Employee Profiles</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.publicProfileEnabled ? 'bg-success text-white' : 'bg-danger text-white'
                              }`}
                            >
                              {selectedPolicy.publicProfileEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.publicProfileEnabled
                              ? 'Public profile viewing enabled'
                              : 'Public profile viewing restricted'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Point Portability</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.portabilityEnabled ? 'bg-success text-white' : 'bg-danger text-white'
                              }`}
                            >
                              {selectedPolicy.portabilityEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.portabilityEnabled
                              ? 'Cross-employer point transfer permitted'
                              : 'Cross-employer point transfer restricted'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Reward Redemption</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.redemptionEnabled ? 'bg-success text-white' : 'bg-danger text-white'
                              }`}
                            >
                              {selectedPolicy.redemptionEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.redemptionEnabled ? 'Catalog redemptions active' : 'Redemption disabled'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Non-Cash Redemption Only</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.nonCashRedemptionOnly ? 'bg-primary text-white' : 'bg-secondary text-white'
                              }`}
                            >
                              {selectedPolicy.nonCashRedemptionOnly ? 'ENFORCED' : 'ALLOW CASH'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.nonCashRedemptionOnly
                              ? 'Restricted to vouchers, gifts, and perks (no cash equivalents)'
                              : 'Cash conversion permitted subject to tax policies'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Automated Decision Making</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.automatedDecisionEnabled ? 'bg-success text-white' : 'bg-secondary text-white'
                              }`}
                            >
                              {selectedPolicy.automatedDecisionEnabled ? 'PERMITTED' : 'RESTRICTED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.automatedDecisionEnabled
                              ? 'Algorithmic reward triggers allowed'
                              : 'Automated decisions restricted; human review required'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Human Review Required</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.humanReviewRequired ? 'bg-warning text-dark' : 'bg-light text-dark border'
                              }`}
                            >
                              {selectedPolicy.humanReviewRequired ? 'REQUIRED' : 'OPTIONAL'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.humanReviewRequired
                              ? 'Nominations require explicit HR manager sign-off'
                              : 'Standard discretionary approval limits apply'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Explicit Consent Required</td>
                          <td>
                            <span
                              className={`badge ${
                                selectedPolicy.consentRequired ? 'bg-primary text-white' : 'bg-light text-dark border'
                              }`}
                            >
                              {selectedPolicy.consentRequired ? 'REQUIRED' : 'STANDARD'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {selectedPolicy.consentRequired
                              ? 'Employee opt-in consent collected before program participation'
                              : 'Employment contract default participation'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Data Storage Location</td>
                          <td>
                            <span className="badge bg-light text-dark border font-monospace">
                              {selectedPolicy.dataLocationPolicy}
                            </span>
                          </td>
                          <td className="text-muted">
                            Designated data residency zone
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Data Retention Policy</td>
                          <td>
                            <span className="badge bg-light text-dark border font-monospace">
                              {selectedPolicy.retentionPolicy}
                            </span>
                          </td>
                          <td className="text-muted">
                            Ledger and audit trail retention lifecycle configuration
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light border-top d-flex justify-content-between">
                  <Link
                    href={`/admin/policies/${selectedPolicy.countryCode}`}
                    className="btn btn-sm btn-primary"
                  >
                    <i className="bi bi-gear me-1"></i> Edit Policy Switches
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSelectedPolicy(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Policy Modal */}
        {showCreateModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 className="modal-title fw-bold mb-0">
                    <i className="bi bi-shield-plus me-2 text-primary"></i>
                    Create Jurisdiction Policy Profile
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreatePolicy}>
                  <div className="modal-body p-4">
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Country <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={createForm.countryCode}
                          onChange={(e) => setCreateForm({ ...createForm, countryCode: e.target.value })}
                          required
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Governance Status
                        </label>
                        <select
                          className="form-select"
                          value={createForm.status}
                          onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                        >
                          <option value="CONFIGURED">Configured jurisdiction policy</option>
                          <option value="DEFAULT_REVIEW_REQUIRED">Policy requires review</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Policy Description & Rationale
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Works-council compliance profile with restricted employee scoring"
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                      />
                    </div>

                    <h6 className="fw-bold text-dark small text-uppercase mb-3 mt-4">
                      Feature Governance Rules
                    </h6>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="leaderboardEnabled"
                            checked={createForm.leaderboardEnabled}
                            onChange={(e) => setCreateForm({ ...createForm, leaderboardEnabled: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="leaderboardEnabled">
                            Enable Public Leaderboards
                          </label>
                          <span className="text-muted d-block small">Permit rank-ordered employee point scoring</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="publicProfileEnabled"
                            checked={createForm.publicProfileEnabled}
                            onChange={(e) => setCreateForm({ ...createForm, publicProfileEnabled: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="publicProfileEnabled">
                            Enable Public Profiles
                          </label>
                          <span className="text-muted d-block small">Allow directory recognition visibility</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="portabilityEnabled"
                            checked={createForm.portabilityEnabled}
                            onChange={(e) => setCreateForm({ ...createForm, portabilityEnabled: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="portabilityEnabled">
                            Enable Point Portability
                          </label>
                          <span className="text-muted d-block small">Cross-employer points export</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="redemptionEnabled"
                            checked={createForm.redemptionEnabled}
                            onChange={(e) => setCreateForm({ ...createForm, redemptionEnabled: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="redemptionEnabled">
                            Enable Reward Redemption
                          </label>
                          <span className="text-muted d-block small">Access to perks & vouchers</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="nonCashRedemptionOnly"
                            checked={createForm.nonCashRedemptionOnly}
                            onChange={(e) => setCreateForm({ ...createForm, nonCashRedemptionOnly: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="nonCashRedemptionOnly">
                            Non-Cash Redemption Only
                          </label>
                          <span className="text-muted d-block small">Prohibit cash conversion</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="automatedDecisionEnabled"
                            checked={createForm.automatedDecisionEnabled}
                            onChange={(e) => setCreateForm({ ...createForm, automatedDecisionEnabled: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="automatedDecisionEnabled">
                            Automated Decision Making
                          </label>
                          <span className="text-muted d-block small">Allow automated reward grants</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="humanReviewRequired"
                            checked={createForm.humanReviewRequired}
                            onChange={(e) => setCreateForm({ ...createForm, humanReviewRequired: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="humanReviewRequired">
                            Human Review Required
                          </label>
                          <span className="text-muted d-block small">Mandatory HR manager sign-off</span>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="consentRequired"
                            checked={createForm.consentRequired}
                            onChange={(e) => setCreateForm({ ...createForm, consentRequired: e.target.checked })}
                          />
                          <label className="form-check-label small fw-semibold" htmlFor="consentRequired">
                            Explicit Employee Consent Required
                          </label>
                          <span className="text-muted d-block small">Prior opt-in collection</span>
                        </div>
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark small text-uppercase mb-3 mt-4">
                      Data Governance
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Data Location Policy
                        </label>
                        <select
                          className="form-select"
                          value={createForm.dataLocationPolicy}
                          onChange={(e) => setCreateForm({ ...createForm, dataLocationPolicy: e.target.value })}
                        >
                          <option value="GLOBAL">GLOBAL (Standard Cloud)</option>
                          <option value="EU_ONLY">EU_ONLY (European Economic Area)</option>
                          <option value="IN_COUNTRY_OPTION">IN_COUNTRY_OPTION (India In-Country)</option>
                          <option value="LOCAL_ONLY">LOCAL_ONLY (Dedicated Domestic)</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Data Retention Policy
                        </label>
                        <select
                          className="form-select"
                          value={createForm.retentionPolicy}
                          onChange={(e) => setCreateForm({ ...createForm, retentionPolicy: e.target.value })}
                        >
                          <option value="STANDARD">STANDARD (Enterprise Default)</option>
                          <option value="CONFIGURABLE">CONFIGURABLE (Tenant Customizable)</option>
                          <option value="STRICT_PRUNING">STRICT_PRUNING (Strict Annual Purge)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer p-3 bg-light border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary"
                      disabled={creatingPolicy}
                    >
                      {creatingPolicy ? 'Saving Profile...' : 'Create Policy Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
