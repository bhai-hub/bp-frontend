'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '../../../../components/DashboardLayout';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import StatCard from '../../../../components/StatCard';
import api from '../../../../lib/api';
import { Organization, BPTransaction, Country, JurisdictionPolicy } from '../../../../types';

export default function OrganizationDetailPage() {
  const params = useParams();
  const orgId = params.id as string;

  const [org, setOrg] = useState<Organization | null>(null);
  const [transactions, setTransactions] = useState<BPTransaction[]>([]);
  const [policyJson, setPolicyJson] = useState<string>('{}');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Purchase Modal
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(25000);
  const [purchaseRef, setPurchaseRef] = useState(`PURCHASE-${Date.now().toString().slice(-6)}`);
  const [purchaseDesc, setPurchaseDesc] = useState('Bulk enterprise reward procurement');
  const [purchaseSubmitting, setPurchaseSubmitting] = useState(false);

  // Policy Save state
  const [isSavingPolicy, setIsSavingPolicy] = useState(false);

  // Change Country Modal state
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [countryReason, setCountryReason] = useState('');
  const [previewPolicy, setPreviewPolicy] = useState<JurisdictionPolicy | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [changingCountry, setChangingCountry] = useState(false);

  // View Policy Details Modal state
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  const fetchOrganizationDetails = async () => {
    try {
      setIsLoading(true);
      const [orgRes, bpRes] = await Promise.all([
        api.get(`/admin/organizations/${orgId}`),
        api.get(`/admin/organizations/${orgId}/bp-account`),
      ]);

      if (orgRes.data.success) {
        setOrg(orgRes.data.data);
        setPolicyJson(JSON.stringify(orgRes.data.data.bpPolicy || {}, null, 2));
      }
      if (bpRes.data.success) {
        setTransactions(bpRes.data.data.transactions);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load organization');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const res = await api.get('/countries');
      if (res.data.success) {
        setCountries(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load countries:', err);
    }
  };

  const loadPolicyPreview = async (countryCode: string) => {
    if (!countryCode) {
      setPreviewPolicy(null);
      return;
    }
    try {
      setLoadingPreview(true);
      const res = await api.get(`/admin/policies/${countryCode}`);
      if (res.data.success) {
        setPreviewPolicy(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load policy preview:', err);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (orgId) {
      fetchOrganizationDetails();
      loadCountries();
    }
  }, [orgId]);

  const handleOpenCountryModal = () => {
    if (org) {
      setSelectedCountryCode(org.countryCode || 'US');
      setCountryReason('');
      loadPolicyPreview(org.countryCode || 'US');
    }
    setShowCountryModal(true);
  };

  const handleCountryChangeSelection = (code: string) => {
    setSelectedCountryCode(code);
    loadPolicyPreview(code);
  };

  const handleChangeCountrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!countryReason.trim()) {
      setError('Reason for country change is required for enterprise auditability');
      return;
    }

    setChangingCountry(true);
    setError(null);

    try {
      const res = await api.patch(`/admin/organizations/${orgId}/country`, {
        countryCode: selectedCountryCode,
        reason: countryReason,
      });

      if (res.data.success) {
        setSuccess(`Organization country updated to ${selectedCountryCode}. Associated jurisdiction policies updated.`);
        setShowCountryModal(false);
        fetchOrganizationDetails();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update country');
    } finally {
      setChangingCountry(false);
    }
  };

  const handlePurchaseBP = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseSubmitting(true);
    setError(null);

    try {
      const res = await api.post(`/admin/organizations/${orgId}/bp-purchases`, {
        quantity: Number(purchaseQuantity),
        reference: purchaseRef,
        description: purchaseDesc,
      });

      if (res.data.success) {
        setSuccess(`Successfully purchased ${purchaseQuantity.toLocaleString()} BP!`);
        setShowPurchaseModal(false);
        fetchOrganizationDetails();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Purchase failed');
    } finally {
      setPurchaseSubmitting(false);
    }
  };

  const handleSavePolicy = async () => {
    setIsSavingPolicy(true);
    setError(null);
    try {
      const parsedPolicy = JSON.parse(policyJson);
      const res = await api.patch(`/admin/organizations/${orgId}/policy`, {
        bpPolicy: parsedPolicy,
      });
      if (res.data.success) {
        setSuccess('Organization BP Policy updated successfully');
        fetchOrganizationDetails();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format for policy');
    } finally {
      setIsSavingPolicy(false);
    }
  };

  const activeJurisdictionPolicy = org?.jurisdictionPolicy;

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
        {/* Back Link & Header */}
        <div className="mb-4">
          <Link href="/admin/organizations" className="text-decoration-none small text-muted mb-2 d-inline-block">
            <i className="bi bi-arrow-left me-1"></i> Back to Organizations
          </Link>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2">
                <h4 className="fw-bold text-dark mb-0">{org?.name || 'Loading Organization...'}</h4>
                {org && (
                  <span
                    className={`enterprise-badge enterprise-badge-${
                      org.status === 'ACTIVE' ? 'active' : 'inactive'
                    }`}
                  >
                    {org.status}
                  </span>
                )}
                {org?.countryCode && (
                  <span className="badge bg-light text-dark border px-2 py-1">
                    <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                    {org.countryCode}
                  </span>
                )}
              </div>
              <p className="text-muted small mb-0 mt-1">
                Legal Entity: {org?.legalName} | Slug: <code>{org?.slug}</code> | Jurisdiction: <strong>{org?.countryName || org?.countryCode}</strong>
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={handleOpenCountryModal}
                className="btn btn-outline-secondary btn-sm"
                title="Change Organization Country"
              >
                <i className="bi bi-globe me-1"></i> Change Country
              </button>
              <button
                onClick={() => setShowPolicyModal(true)}
                className="btn btn-outline-primary btn-sm"
                title="View Configured Policy"
              >
                <i className="bi bi-shield-check me-1"></i> View Jurisdiction Policy
              </button>
              <button
                onClick={() => {
                  setPurchaseRef(`PURCHASE-${Date.now().toString().slice(-6)}`);
                  setShowPurchaseModal(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <i className="bi bi-plus-circle me-1"></i> Purchase BP
              </button>
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
        ) : (
          <>
            {/* BP Account Overview */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <StatCard
                  label="Purchased Brownie Points"
                  value={`${(org?.bpAccount?.purchasedBP || 0).toLocaleString()} BP`}
                  icon="bi-cash-coin"
                  subtext="Total lifetime company purchases"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  label="Allocated to Employees"
                  value={`${(org?.bpAccount?.allocatedBP || 0).toLocaleString()} BP`}
                  icon="bi-award"
                  subtext="Disbursed to staff wallets"
                />
              </div>
              <div className="col-md-4">
                <StatCard
                  label="Available BP Pool"
                  value={`${(org?.bpAccount?.availableBP || 0).toLocaleString()} BP`}
                  icon="bi-wallet2"
                  badge={{ text: 'Disbursable', variant: 'success' }}
                  subtext="Ready for HR credit operations"
                />
              </div>
            </div>

            {/* Jurisdiction Governance Highlight Banner */}
            <div className="enterprise-card mb-4 border-start border-4 border-primary">
              <div className="p-3 d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded p-2 bg-primary-subtle text-primary fs-4">
                    <i className="bi bi-shield-lock"></i>
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 fw-bold">
                        Jurisdiction Policy: {org?.countryName || org?.countryCode} ({org?.countryCode})
                      </h6>
                      <span className="badge bg-secondary">
                        v{org?.jurisdictionPolicyVersion || activeJurisdictionPolicy?.policyVersion || 1}
                      </span>
                      <span
                        className={`badge ${
                          activeJurisdictionPolicy?.status === 'CONFIGURED'
                            ? 'bg-success text-white'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {activeJurisdictionPolicy?.status === 'CONFIGURED'
                          ? 'Configured jurisdiction policy'
                          : 'Policy requires review'}
                      </span>
                    </div>
                    <p className="text-muted small mb-0 mt-1">
                      {activeJurisdictionPolicy?.description || 'Active country jurisdiction rule enforcement profile.'}
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span
                    className={`badge ${
                      activeJurisdictionPolicy?.leaderboardEnabled
                        ? 'bg-success-subtle text-success border border-success-subtle'
                        : 'bg-danger-subtle text-danger border border-danger-subtle'
                    }`}
                  >
                    <i className={`bi ${activeJurisdictionPolicy?.leaderboardEnabled ? 'bi-check' : 'bi-x'} me-1`}></i>
                    Leaderboards
                  </span>
                  <span
                    className={`badge ${
                      activeJurisdictionPolicy?.publicProfileEnabled
                        ? 'bg-success-subtle text-success border border-success-subtle'
                        : 'bg-danger-subtle text-danger border border-danger-subtle'
                    }`}
                  >
                    <i className={`bi ${activeJurisdictionPolicy?.publicProfileEnabled ? 'bi-check' : 'bi-x'} me-1`}></i>
                    Public Profiles
                  </span>
                  <span
                    className={`badge ${
                      activeJurisdictionPolicy?.humanReviewRequired
                        ? 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
                        : 'bg-info-subtle text-info border border-info-subtle'
                    }`}
                  >
                    <i className="bi bi-person-check me-1"></i>
                    {activeJurisdictionPolicy?.humanReviewRequired ? 'Human Review Required' : 'Automated Review'}
                  </span>
                  <span className="badge bg-light text-dark border">
                    <i className="bi bi-database me-1 text-secondary"></i>
                    {activeJurisdictionPolicy?.dataLocationPolicy || 'STANDARD'}
                  </span>
                  <button
                    onClick={() => setShowPolicyModal(true)}
                    className="btn btn-sm btn-link text-decoration-none p-0 ms-2"
                  >
                    All Feature Rules &rarr;
                  </button>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              {/* Organization Info Card */}
              <div className="col-lg-6">
                <div className="enterprise-card h-100">
                  <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                    <span>Corporate Metadata</span>
                    <button
                      onClick={handleOpenCountryModal}
                      className="btn btn-sm btn-link text-decoration-none p-0"
                    >
                      <i className="bi bi-pencil me-1"></i>Edit Country
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="row g-3 small">
                      <div className="col-6">
                        <span className="text-muted d-block">Contact Email</span>
                        <span className="fw-semibold text-dark">{org?.email}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Phone</span>
                        <span className="fw-semibold text-dark">{org?.phone}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Operating Country</span>
                        <span className="fw-semibold text-dark">
                          {org?.countryName || org?.countryCode} ({org?.countryCode})
                        </span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Accounting Currency</span>
                        <span className="fw-semibold text-dark">{org?.currency}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Timezone</span>
                        <span className="fw-semibold text-dark">{org?.timezone}</span>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block">Creation Date</span>
                        <span className="fw-semibold text-dark">
                          {org?.createdAt ? new Date(org.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BP Policy Configuration */}
              <div className="col-lg-6">
                <div className="enterprise-card h-100">
                  <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                    <span>Configurable BP Policy (JSON)</span>
                    <button
                      onClick={handleSavePolicy}
                      className="btn btn-sm btn-outline-primary py-1 px-2"
                      disabled={isSavingPolicy}
                    >
                      {isSavingPolicy ? 'Saving...' : 'Save Policy'}
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-muted small mb-2">
                      Edit enterprise rules like monthly employee caps, discretionary budgets, and welcome bonuses.
                    </p>
                    <textarea
                      className="form-control font-monospace small"
                      rows={7}
                      value={policyJson}
                      onChange={(e) => setPolicyJson(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* BP Transaction Ledger */}
            <div className="enterprise-card">
              <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                <span>Organization BP Ledger Transactions</span>
                <span className="text-muted small">Total: {transactions.length} entries</span>
              </div>
              <div className="table-responsive">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Date / Time</th>
                      <th>Type</th>
                      <th>Reference</th>
                      <th>Description</th>
                      <th>Recipient / Employee</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          No ledger transactions recorded for this organization.
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td className="small text-muted">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {tx.type}
                            </span>
                          </td>
                          <td><code>{tx.reference}</code></td>
                          <td className="small">{tx.description}</td>
                          <td className="small">
                            {tx.employee ? (
                              <span className="fw-semibold">
                                {tx.employee.user.firstName} {tx.employee.user.lastName}
                              </span>
                            ) : (
                              <span className="text-muted">Organization Treasury</span>
                            )}
                          </td>
                          <td className="text-end fw-bold">
                            {tx.type === 'PURCHASE' ? (
                              <span className="text-success">+{tx.amount.toLocaleString()} BP</span>
                            ) : (
                              <span className="text-primary">{tx.amount.toLocaleString()} BP</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Change Country Modal */}
        {showCountryModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 className="modal-title fw-bold mb-0">
                    <i className="bi bi-globe me-2 text-primary"></i>
                    Change Organization Jurisdiction Country
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCountryModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleChangeCountrySubmit}>
                  <div className="modal-body p-4">
                    {/* Advisory Alert */}
                    <div className="alert alert-warning py-3 px-3 small mb-4" role="alert">
                      <div className="d-flex align-items-start gap-2">
                        <i className="bi bi-exclamation-triangle-fill fs-5 mt-n1 text-warning flex-shrink-0"></i>
                        <div>
                          <strong>Important Governance Notice:</strong> Changing the organization's country may change available product features and policy requirements (e.g., public leaderboards, profiles, automated approvals, and data storage location).
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Current Country
                        </label>
                        <div className="form-control bg-light text-muted">
                          {org?.countryName} ({org?.countryCode})
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          New Country <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedCountryCode}
                          onChange={(e) => handleCountryChangeSelection(e.target.value)}
                          required
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Live Policy Preview */}
                    <div className="p-3 bg-light rounded border mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="small fw-bold text-dark">
                          Policy Rules for {selectedCountryCode} (v{previewPolicy?.policyVersion || 1})
                        </span>
                        <span
                          className={`badge ${
                            previewPolicy?.status === 'CONFIGURED'
                              ? 'bg-success text-white'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {previewPolicy?.status === 'CONFIGURED'
                            ? 'Configured jurisdiction policy'
                            : 'Policy requires review'}
                        </span>
                      </div>
                      {loadingPreview ? (
                        <div className="text-center py-2">
                          <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                        </div>
                      ) : previewPolicy ? (
                        <div>
                          <p className="small text-muted mb-2">{previewPolicy.description}</p>
                          <div className="row g-2 small">
                            <div className="col-6 col-md-3">
                              <span className="text-muted d-block">Leaderboards:</span>
                              <span className={previewPolicy.leaderboardEnabled ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                                {previewPolicy.leaderboardEnabled ? '✓ Enabled' : '✗ Disabled'}
                              </span>
                            </div>
                            <div className="col-6 col-md-3">
                              <span className="text-muted d-block">Public Profiles:</span>
                              <span className={previewPolicy.publicProfileEnabled ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                                {previewPolicy.publicProfileEnabled ? '✓ Enabled' : '✗ Disabled'}
                              </span>
                            </div>
                            <div className="col-6 col-md-3">
                              <span className="text-muted d-block">Human Review:</span>
                              <span className="fw-semibold text-dark">
                                {previewPolicy.humanReviewRequired ? 'Required' : 'Optional'}
                              </span>
                            </div>
                            <div className="col-6 col-md-3">
                              <span className="text-muted d-block">Data Location:</span>
                              <span className="fw-semibold text-dark">
                                {previewPolicy.dataLocationPolicy}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="small text-muted">No policy profile loaded.</div>
                      )}
                    </div>

                    {/* Audit Reason Input */}
                    <div className="mb-2">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Reason for Change <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control small"
                        rows={3}
                        placeholder="Please document the business, legal, or administrative rationale for changing this organization's operating jurisdiction..."
                        value={countryReason}
                        onChange={(e) => setCountryReason(e.target.value)}
                        required
                      ></textarea>
                      <small className="form-text text-muted">
                        This reason is recorded in the platform audit trail for compliance verification.
                      </small>
                    </div>
                  </div>

                  <div className="modal-footer p-3 bg-light border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowCountryModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary"
                      disabled={changingCountry || selectedCountryCode === org?.countryCode}
                    >
                      {changingCountry ? 'Updating Jurisdiction...' : 'Confirm Jurisdiction Change'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* View Policy Configuration Modal */}
        {showPolicyModal && activeJurisdictionPolicy && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="modal-title fw-bold mb-0">
                      Jurisdiction Policy Profile — {org?.countryName || org?.countryCode} ({org?.countryCode})
                    </h6>
                    <span className="badge bg-secondary">
                      v{activeJurisdictionPolicy.policyVersion}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPolicyModal(false)}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="text-muted small d-block">Policy Status</span>
                      <span
                        className={`badge ${
                          activeJurisdictionPolicy.status === 'CONFIGURED'
                            ? 'bg-success text-white'
                            : 'bg-warning text-dark'
                        }`}
                      >
                        {activeJurisdictionPolicy.status === 'CONFIGURED'
                          ? 'Configured jurisdiction policy'
                          : 'Policy requires review'}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="text-muted small d-block">Effective Date</span>
                      <span className="small fw-semibold text-dark">
                        {new Date(activeJurisdictionPolicy.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {activeJurisdictionPolicy.description && (
                    <div className="p-3 bg-light rounded border mb-4">
                      <div className="text-muted small fw-semibold mb-1">Policy Description & Rationale</div>
                      <div className="small text-dark">{activeJurisdictionPolicy.description}</div>
                    </div>
                  )}

                  <h6 className="fw-bold text-dark small text-uppercase mb-3">
                    Active Feature Switches & Governance Rules
                  </h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle">
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
                                activeJurisdictionPolicy.leaderboardEnabled
                                  ? 'bg-success text-white'
                                  : 'bg-danger text-white'
                              }`}
                            >
                              {activeJurisdictionPolicy.leaderboardEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.leaderboardEnabled
                              ? 'Leaderboards accessible by authorized staff'
                              : 'Leaderboards restricted by jurisdiction policy (e.g. works council or anti-scoring regulations)'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Public Employee Profiles</td>
                          <td>
                            <span
                              className={`badge ${
                                activeJurisdictionPolicy.publicProfileEnabled
                                  ? 'bg-success text-white'
                                  : 'bg-danger text-white'
                              }`}
                            >
                              {activeJurisdictionPolicy.publicProfileEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.publicProfileEnabled
                              ? 'Public profile viewing enabled'
                              : 'Public profile viewing restricted'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Point Portability</td>
                          <td>
                            <span
                              className={`badge ${
                                activeJurisdictionPolicy.portabilityEnabled
                                  ? 'bg-success text-white'
                                  : 'bg-danger text-white'
                              }`}
                            >
                              {activeJurisdictionPolicy.portabilityEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.portabilityEnabled
                              ? 'Transfer/export between employers permitted'
                              : 'Cross-employer point transfer disabled'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Reward Redemption</td>
                          <td>
                            <span
                              className={`badge ${
                                activeJurisdictionPolicy.redemptionEnabled
                                  ? 'bg-success text-white'
                                  : 'bg-danger text-white'
                              }`}
                            >
                              {activeJurisdictionPolicy.redemptionEnabled ? 'ENABLED' : 'DISABLED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.redemptionEnabled
                              ? 'Catalog redemptions active'
                              : 'Redemption features disabled'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Non-Cash Redemption Only</td>
                          <td>
                            <span
                              className={`badge ${
                                activeJurisdictionPolicy.nonCashRedemptionOnly
                                  ? 'bg-primary text-white'
                                  : 'bg-secondary text-white'
                              }`}
                            >
                              {activeJurisdictionPolicy.nonCashRedemptionOnly ? 'ENFORCED' : 'ALLOW CASH'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.nonCashRedemptionOnly
                              ? 'Restricted to vouchers, gifts, and perks (no cash equivalents)'
                              : 'Cash conversion permitted subject to tax policies'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Automated Decision Making</td>
                          <td>
                            <span
                              className={`badge ${
                                activeJurisdictionPolicy.automatedDecisionEnabled
                                  ? 'bg-success text-white'
                                  : 'bg-secondary text-white'
                              }`}
                            >
                              {activeJurisdictionPolicy.automatedDecisionEnabled ? 'PERMITTED' : 'RESTRICTED'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.automatedDecisionEnabled
                              ? 'Algorithmic reward triggers allowed'
                              : 'Automated decisions restricted; human in the loop required'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Human Review Required</td>
                          <td>
                            <span
                              className={`badge ${
                                activeJurisdictionPolicy.humanReviewRequired
                                  ? 'bg-warning text-dark'
                                  : 'bg-light text-dark border'
                              }`}
                            >
                              {activeJurisdictionPolicy.humanReviewRequired ? 'REQUIRED' : 'OPTIONAL'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.humanReviewRequired
                              ? 'Nominations & redemptions require explicit HR manager sign-off'
                              : 'Standard discretionary approval limits apply'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Explicit Consent Required</td>
                          <td>
                            <span
                              className={`badge ${
                                activeJurisdictionPolicy.consentRequired
                                  ? 'bg-primary text-white'
                                  : 'bg-light text-dark border'
                              }`}
                            >
                              {activeJurisdictionPolicy.consentRequired ? 'REQUIRED' : 'STANDARD'}
                            </span>
                          </td>
                          <td className="text-muted">
                            {activeJurisdictionPolicy.consentRequired
                              ? 'Employee opt-in consent collected before program participation'
                              : 'Employment contract default participation'}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Data Storage Location</td>
                          <td>
                            <span className="badge bg-light text-dark border font-monospace">
                              {activeJurisdictionPolicy.dataLocationPolicy}
                            </span>
                          </td>
                          <td className="text-muted">
                            Designated data residency zone for jurisdiction tenant data
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Data Retention Policy</td>
                          <td>
                            <span className="badge bg-light text-dark border font-monospace">
                              {activeJurisdictionPolicy.retentionPolicy}
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
                  <Link href="/admin/policies" className="btn btn-sm btn-outline-secondary">
                    <i className="bi bi-gear me-1"></i> Manage Global Policies
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => setShowPolicyModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase BP Modal */}
        {showPurchaseModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 className="modal-title fw-bold mb-0">Procure Brownie Points for {org?.name}</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPurchaseModal(false)}
                  ></button>
                </div>
                <form onSubmit={handlePurchaseBP}>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-3">
                      This simulated purchase creates a <code>PURCHASE</code> transaction in the ledger and immediately increments both purchased BP and available BP.
                    </p>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Quantity of Brownie Points
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="1000"
                        className="form-control"
                        value={purchaseQuantity}
                        onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Reference Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={purchaseRef}
                        onChange={(e) => setPurchaseRef(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-muted text-uppercase">
                        Description / Purchase Order
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={purchaseDesc}
                        onChange={(e) => setPurchaseDesc(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer p-3 bg-light border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowPurchaseModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary"
                      disabled={purchaseSubmitting}
                    >
                      {purchaseSubmitting ? 'Processing...' : 'Confirm BP Purchase'}
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
