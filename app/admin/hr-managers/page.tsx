'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { Organization } from '../../../types';

export default function AdminHrManagersPage() {
  const [hrManagers, setHrManagers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Hr@' + Math.floor(100000 + Math.random() * 900000),
    organizationId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [hrRes, orgRes] = await Promise.all([
        api.get('/admin/hr-managers'),
        api.get('/admin/organizations'),
      ]);
      if (hrRes.data.success) {
        setHrManagers(hrRes.data.data);
      }
      if (orgRes.data.success) {
        setOrganizations(orgRes.data.data);
        if (orgRes.data.data.length > 0 && !formData.organizationId) {
          setFormData((prev) => ({ ...prev, organizationId: orgRes.data.data[0].id }));
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load HR Managers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateHr = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/admin/hr-managers', formData);
      if (res.data.success) {
        setSuccess(`HR Manager ${formData.firstName} ${formData.lastName} assigned successfully!`);
        setShowModal(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: 'Hr@' + Math.floor(100000 + Math.random() * 900000),
          organizationId: organizations[0]?.id || '',
        });
        fetchData();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create HR Manager');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">HR Managers Directory</h4>
            <p className="text-muted small mb-0">
              Provision organizational administrators who govern employee wallets and awards.
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
            <i className="bi bi-person-plus me-1"></i> Provision HR Manager
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
                  <th>HR Manager</th>
                  <th>Assigned Organization</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Provisioned Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading HR Managers...
                    </td>
                  </tr>
                ) : hrManagers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-muted">
                      No HR Managers found.
                    </td>
                  </tr>
                ) : (
                  hrManagers.map((hr) => (
                    <tr key={hr.id}>
                      <td>
                        <div className="fw-semibold text-dark">{hr.firstName} {hr.lastName}</div>
                        <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                          {hr.email}
                        </div>
                      </td>
                      <td className="fw-semibold text-primary">
                        {hr.organization ? hr.organization.name : 'Unassigned'}
                      </td>
                      <td>
                        <span className="enterprise-badge enterprise-badge-blue">
                          HR_MANAGER
                        </span>
                      </td>
                      <td>
                        <span className={`enterprise-badge enterprise-badge-${hr.status === 'ACTIVE' ? 'active' : 'inactive'}`}>
                          {hr.status}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {new Date(hr.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create HR Manager Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 className="modal-title fw-bold mb-0">Provision New HR Manager</h6>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleCreateHr}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted text-uppercase">
                          Target Organization
                        </label>
                        <select
                          className="form-select"
                          value={formData.organizationId}
                          onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                          required
                        >
                          <option value="">Select Organization</option>
                          {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-muted text-uppercase">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted text-uppercase">Work Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold text-muted text-uppercase">Temporary Password</label>
                        <input
                          type="text"
                          className="form-control font-monospace"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer p-3 bg-light border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'Provisioning...' : 'Provision HR Manager'}
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
