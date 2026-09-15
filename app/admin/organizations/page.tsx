'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { Organization, Country, JurisdictionPolicy } from '../../../types';

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    slug: '',
    email: '',
    phone: '',
    countryCode: 'US',
    timezone: 'America/New_York',
    currency: 'USD',
  });
  const [activePolicyPreview, setActivePolicyPreview] = useState<JurisdictionPolicy | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [orgRes, countryRes] = await Promise.all([
        api.get('/admin/organizations'),
        api.get('/countries'),
      ]);

      if (orgRes.data.success) {
        setOrganizations(orgRes.data.data);
      }
      if (countryRes.data.success) {
        setCountries(countryRes.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch policy preview when countryCode changes in create modal
  useEffect(() => {
    const fetchPolicyPreview = async () => {
      if (!formData.countryCode) return;
      try {
        const res = await api.get(`/admin/policies/${formData.countryCode}`);
        if (res.data.success) {
          setActivePolicyPreview(res.data.data);
        }
      } catch {
        setActivePolicyPreview(null);
      }
    };

    if (showCreateModal) {
      fetchPolicyPreview();
    }
  }, [formData.countryCode, showCreateModal]);

  const handleToggleStatus = async (orgId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setError(null);
      const res = await api.patch(`/admin/organizations/${orgId}/status`, {
        status: nextStatus,
      });
      if (res.data.success) {
        setSuccess(`Organization status updated to ${nextStatus}`);
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update organization status');
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/admin/organizations', formData);
      if (res.data.success) {
        setSuccess(
          `Organization "${formData.name}" registered successfully with ${formData.countryCode} Jurisdiction Policy (v${res.data.data.jurisdictionPolicyVersion})!`,
        );
        setShowCreateModal(false);
        setFormData({
          name: '',
          legalName: '',
          slug: '',
          email: '',
          phone: '',
          countryCode: 'US',
          timezone: 'America/New_York',
          currency: 'USD',
        });
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create organization');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">Organizations Directory</h4>
            <p className="text-muted small mb-0">
              Multi-tenant corporate workspaces, jurisdiction policies, and BP treasury accounts.
            </p>
          </div>
          <button
            onClick={() => {
              setShowCreateModal(true);
              setError(null);
            }}
            className="btn btn-primary btn-sm"
          >
            <i className="bi bi-plus-lg me-1"></i> Add New Organization
          </button>
        </div>

        {success && (
          <div className="alert alert-success py-2 px-3 small mb-4 alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i> {success}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        <div className="enterprise-card">
          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th>Organization Name</th>
                  <th>Legal Entity</th>
                  <th>Country & Jurisdiction</th>
                  <th>Status</th>
                  <th>Purchased BP</th>
                  <th>Available BP</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading organizations...
                    </td>
                  </tr>
                ) : organizations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      No organizations found.
                    </td>
                  </tr>
                ) : (
                  organizations.map((org) => (
                    <tr key={org.id}>
                      <td className="fw-bold text-dark">
                        <Link href={`/admin/organizations/${org.id}`} className="text-dark text-decoration-none">
                          {org.name}
                        </Link>
                        <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                          {org.email} | <code>{org.slug}</code>
                        </div>
                      </td>
                      <td className="text-muted small">{org.legalName}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-light text-dark border font-monospace">
                            {org.countryCode}
                          </span>
                          <div>
                            <span className="fw-semibold text-dark small">{org.countryName}</span>
                            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                              Policy: v{org.jurisdictionPolicyVersion}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(org.id, org.status)}
                          className="btn p-0 border-0"
                          title="Click to toggle status"
                        >
                          <span
                            className={`enterprise-badge enterprise-badge-${
                              org.status === 'ACTIVE' ? 'active' : 'inactive'
                            }`}
                          >
                            {org.status}
                          </span>
                        </button>
                      </td>
                      <td className="fw-semibold">
                        {(org.bpAccount?.purchasedBP || 0).toLocaleString()} BP
                      </td>
                      <td className="fw-semibold text-primary">
                        {(org.bpAccount?.availableBP || 0).toLocaleString()} BP
                      </td>
                      <td className="text-end">
                        <Link
                          href={`/admin/organizations/${org.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Organization Modal */}
        {showCreateModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 className="modal-title fw-bold mb-0">Register New Enterprise Organization</h6>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCreateModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreateOrganization}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Acme Technologies"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Legal Entity Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Acme Technologies Inc."
                          value={formData.legalName}
                          onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                          required
                        />
                      </div>

                      {/* Country Selection (Mandatory) */}
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Operating Country *
                        </label>
                        <select
                          className="form-select"
                          value={formData.countryCode}
                          onChange={(e) => {
                            const newCode = e.target.value;
                            setFormData({
                              ...formData,
                              countryCode: newCode,
                              currency: newCode === 'IN' ? 'INR' : newCode === 'DE' || newCode === 'FR' ? 'EUR' : newCode === 'GB' ? 'GBP' : 'USD',
                            });
                          }}
                          required
                        >
                          {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                        <div className="form-text small" style={{ fontSize: '0.72rem' }}>
                          Primary jurisdiction input for regulatory feature policies.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Accounting Currency
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.currency}
                          onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Contact Email *
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="admin@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Phone *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="+1 555 0123"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>

                      {/* Dynamic Jurisdiction Policy Information Panel */}
                      <div className="col-12">
                        <div className="p-3 bg-light border">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="small fw-bold text-dark text-uppercase">
                              <i className="bi bi-shield-lock me-1 text-primary"></i> Resolved Jurisdiction Policy
                            </span>
                            {activePolicyPreview && (
                              <span
                                className={`enterprise-badge enterprise-badge-${
                                  activePolicyPreview.status === 'CONFIGURED' ? 'active' : 'inactive'
                                }`}
                              >
                                {activePolicyPreview.status === 'CONFIGURED' ? 'Configured' : 'Requires Review'}
                              </span>
                            )}
                          </div>

                          {activePolicyPreview ? (
                            <div className="small text-muted">
                              <div className="d-flex justify-content-between mb-1">
                                <span>Country / Jurisdiction:</span>
                                <span className="fw-semibold text-dark">
                                  {countries.find((c) => c.code === formData.countryCode)?.name || formData.countryCode} ({formData.countryCode})
                                </span>
                              </div>
                              <div className="d-flex justify-content-between mb-2">
                                <span>Active Policy Version:</span>
                                <span className="fw-semibold text-dark">
                                  Version {activePolicyPreview.policyVersion}
                                </span>
                              </div>

                              <div className="d-flex flex-wrap gap-2 pt-2 border-top">
                                <span className={`badge ${activePolicyPreview.leaderboardEnabled ? 'bg-success' : 'bg-secondary'}`}>
                                  Leaderboard: {activePolicyPreview.leaderboardEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <span className={`badge ${activePolicyPreview.publicProfileEnabled ? 'bg-success' : 'bg-secondary'}`}>
                                  Public Profiles: {activePolicyPreview.publicProfileEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <span className={`badge ${activePolicyPreview.portabilityEnabled ? 'bg-success' : 'bg-secondary'}`}>
                                  Portability: {activePolicyPreview.portabilityEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                                <span className="badge bg-light text-dark border">
                                  Data: {activePolicyPreview.dataLocationPolicy}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="small text-muted">Loading policy parameters for {formData.countryCode}...</div>
                          )}
                        </div>
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating Organization...' : 'Register Organization'}
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
