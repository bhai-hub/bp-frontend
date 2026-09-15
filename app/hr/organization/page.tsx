'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';

export default function HrOrganizationPage() {
  const [org, setOrg] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/hr/organization');
        if (res.data.success) {
          setOrg(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load organization');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrg();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['HR_MANAGER']}>
      <DashboardLayout allowedRoles={['HR_MANAGER']}>
        <div className="mb-4">
          <div className="d-flex align-items-center gap-2">
            <h4 className="fw-bold text-dark mb-0">Organization Profile & Policy</h4>
            {org && (
              <span className="enterprise-badge enterprise-badge-active">
                {org.status}
              </span>
            )}
          </div>
          <p className="text-muted small mb-0 mt-1">
            Enterprise boundary information and active Brownie Points allocation rules.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="enterprise-card h-100">
                <div className="enterprise-card-header">
                  <span>General Information</span>
                </div>
                <div className="p-4">
                  <div className="row g-3 small">
                    <div className="col-12">
                      <span className="text-muted d-block">Organization Name</span>
                      <span className="fw-bold fs-6 text-dark">{org?.name}</span>
                    </div>
                    <div className="col-12">
                      <span className="text-muted d-block">Legal Entity Name</span>
                      <span className="fw-semibold text-dark">{org?.legalName}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Slug Identifier</span>
                      <code>{org?.slug}</code>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Corporate Currency</span>
                      <span className="fw-semibold text-dark">{org?.currency}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Contact Email</span>
                      <span className="fw-semibold text-dark">{org?.email}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Contact Phone</span>
                      <span className="fw-semibold text-dark">{org?.phone}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Country</span>
                      <span className="fw-semibold text-dark">{org?.country}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Timezone</span>
                      <span className="fw-semibold text-dark">{org?.timezone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="enterprise-card h-100">
                <div className="enterprise-card-header">
                  <span>Active Brownie Points Policy</span>
                </div>
                <div className="p-4">
                  <div className="p-3 bg-light border mb-3">
                    <div className="fw-semibold text-dark small mb-1">Monthly Employee Cap</div>
                    <div className="fs-5 fw-bold text-primary">
                      {(org?.bpPolicy?.monthlyCapPerEmployee || 10000).toLocaleString()} BP
                    </div>
                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      Maximum recognition an individual employee can receive in a 30-day window.
                    </div>
                  </div>

                  <div className="p-3 bg-light border mb-3">
                    <div className="fw-semibold text-dark small mb-1">Discretionary Manager Awards</div>
                    <div className="fw-bold text-success">
                      {org?.bpPolicy?.allowManagerDiscretionaryCredit !== false ? 'Enabled' : 'Disabled'}
                    </div>
                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      Allows HR and managers to issue instant on-the-spot recognition.
                    </div>
                  </div>

                  <div className="p-3 bg-light border">
                    <div className="fw-semibold text-dark small mb-1">New Hire Welcome Allocation</div>
                    <div className="fs-5 fw-bold text-dark">
                      {(org?.bpPolicy?.welcomeBonusBP || 1000).toLocaleString()} BP
                    </div>
                    <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                      Default starter balance provisioned for newly onboarded staff.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
