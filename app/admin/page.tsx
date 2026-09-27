'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatCard from '../../components/StatCard';
import api from '../../lib/api';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Purchase BP Modal state
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [purchaseQuantity, setPurchaseQuantity] = useState(50000);
  const [purchaseRef, setPurchaseRef] = useState(`PURCHASE-${Date.now().toString().slice(-6)}`);
  const [purchaseSubmitting, setPurchaseSubmitting] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data.data);
        if (res.data.data.recentOrganizations?.length > 0 && !selectedOrgId) {
          setSelectedOrgId(res.data.data.recentOrganizations[0].id);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleExecutePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrgId || purchaseQuantity <= 0) return;

    setPurchaseSubmitting(true);
    setPurchaseSuccess(null);
    setError(null);

    try {
      const res = await api.post(`/admin/organizations/${selectedOrgId}/bp-purchases`, {
        quantity: Number(purchaseQuantity),
        reference: purchaseRef,
        description: 'Simulated Super Admin procurement',
      });

      if (res.data.success) {
        setPurchaseSuccess(`Successfully purchased ${purchaseQuantity.toLocaleString()} BP for organization!`);
        setShowPurchaseModal(false);
        fetchDashboard();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'BP purchase execution failed');
    } finally {
      setPurchaseSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
        {/* Page Title & Actions */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">Super Admin Dashboard</h4>
            <p className="text-muted small mb-0">
              System-wide metrics, multi-tenant organizations, and global Brownie Points reserves.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={() => {
                setPurchaseRef(`PURCHASE-${Date.now().toString().slice(-6)}`);
                setShowPurchaseModal(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <i className="bi bi-cart-plus me-1"></i> Purchase BP for Organization
            </button>
            <Link href="/admin/organizations" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-building-add me-1"></i> Manage Organizations
            </Link>
          </div>
        </div>

        {purchaseSuccess && (
          <div className="alert alert-success py-2 px-3 small mb-4 alert-dismissible fade show" role="alert">
            <i className="bi bi-check-circle-fill me-2" aria-hidden="true"></i> {purchaseSuccess}
            <button type="button" className="btn-close" aria-label="Dismiss alert" onClick={() => setPurchaseSuccess(null)}></button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i> {error}
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
            {/* 7 Admin KPI Cards */}
            <div className="row g-3 mb-4">
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="Organizations"
                  value={data?.metrics?.totalOrganizations || 0}
                  icon="bi-building"
                  subtext={`${data?.metrics?.activeOrganizations || 0} currently active`}
                />
              </div>
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="Active Organizations"
                  value={data?.metrics?.activeOrganizations || 0}
                  icon="bi-check-circle"
                  badge={{ text: 'Operational', variant: 'success' }}
                />
              </div>
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="HR Managers"
                  value={data?.metrics?.totalHrManagers || 0}
                  icon="bi-people"
                  subtext="Assigned administrators"
                />
              </div>
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="Total Employees"
                  value={data?.metrics?.totalEmployees || 0}
                  icon="bi-person-badge"
                  subtext="Across all tenants"
                />
              </div>

              {/* BP Financial Figures */}
              <div className="col-xl-4 col-md-6">
                <StatCard
                  label="Total BP Purchased"
                  value={`${(data?.metrics?.totalBPPurchased || 0).toLocaleString()} BP`}
                  icon="bi-cash-coin"
                  subtext="Cumulative corporate procurement"
                />
              </div>
              <div className="col-xl-4 col-md-6">
                <StatCard
                  label="Total BP Allocated"
                  value={`${(data?.metrics?.totalBPAllocated || 0).toLocaleString()} BP`}
                  icon="bi-award"
                  subtext="Credited to employee wallets"
                />
              </div>
              <div className="col-xl-4 col-md-12">
                <StatCard
                  label="Available BP Reserve"
                  value={`${(data?.metrics?.totalBPAvailable || 0).toLocaleString()} BP`}
                  icon="bi-piggy-bank"
                  badge={{ text: 'Ready Pool', variant: 'info' }}
                  subtext="Available for HR disbursement"
                />
              </div>
            </div>

            <div className="row g-4 mb-4">
              {/* Organizations Table */}
              <div className="col-lg-8">
                <div className="enterprise-card">
                  <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                    <span>Organizations Directory</span>
                    <Link href="/admin/organizations" className="text-decoration-none small">
                      View All <i className="bi bi-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </div>
                  <div className="table-responsive">
                    <table className="enterprise-table">
                      <thead>
                        <tr>
                          <th scope="col">Organization</th>
                          <th scope="col">Slug</th>
                          <th scope="col">Status</th>
                          <th scope="col">Purchased BP</th>
                          <th scope="col">Available BP</th>
                          <th scope="col" className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.recentOrganizations?.map((org: any) => (
                          <tr key={org.id}>
                            <td>
                              <div className="fw-semibold text-dark">{org.name}</div>
                              <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                                {org.email}
                              </div>
                            </td>
                            <td><code>{org.slug}</code></td>
                            <td>
                              <span
                                className={`enterprise-badge enterprise-badge-${
                                  org.status === 'ACTIVE' ? 'active' : 'inactive'
                                }`}
                              >
                                {org.status}
                              </span>
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
                                className="btn btn-sm btn-outline-primary py-1 px-2"
                                aria-label={`View details for organization ${org.name}`}
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Audit Trail */}
              <div id="audit" className="col-lg-4">
                <div className="enterprise-card h-100">
                  <div className="enterprise-card-header">
                    <span>System Audit Trail</span>
                  </div>
                  <div className="p-3">
                    {data?.recentActivity?.length === 0 ? (
                      <div className="text-muted small text-center py-4">No audit logs recorded yet.</div>
                    ) : (
                      <div className="d-flex flex-column gap-3">
                        {data?.recentActivity?.map((audit: any) => (
                          <div key={audit.id} className="border-bottom pb-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span className="fw-bold small text-dark">{audit.action}</span>
                              <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                {new Date(audit.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                              Org: {audit.organization?.name || 'Global'} | User: {audit.user?.firstName || 'System'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Purchase BP Modal */}
        {showPurchaseModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-bp-modal-title"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 id="purchase-bp-modal-title" className="modal-title fw-bold mb-0">Execute Simulated BP Purchase</h6>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close dialog"
                    onClick={() => setShowPurchaseModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleExecutePurchase}>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-3">
                      Simulated corporate procurement. Points will be minted into the organization available reserve and recorded into the ledger.
                    </p>

                    <div className="mb-3">
                      <label htmlFor="purchase-org-select" className="form-label small fw-semibold text-muted text-uppercase letter-spacing">
                        Target Organization
                      </label>
                      <select
                        id="purchase-org-select"
                        className="form-select"
                        value={selectedOrgId}
                        onChange={(e) => setSelectedOrgId(e.target.value)}
                        required
                        aria-required="true"
                      >
                        <option value="">Select Organization</option>
                        {data?.recentOrganizations?.map((org: any) => (
                          <option key={org.id} value={org.id}>
                            {org.name} (Current: {(org.bpAccount?.availableBP || 0).toLocaleString()} BP)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="purchase-bp-quantity" className="form-label small fw-semibold text-muted text-uppercase letter-spacing">
                        BP Quantity to Purchase
                      </label>
                      <input
                        id="purchase-bp-quantity"
                        type="number"
                        min="1"
                        step="1000"
                        className="form-control"
                        value={purchaseQuantity}
                        onChange={(e) => setPurchaseQuantity(Number(e.target.value))}
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="purchase-ref-code" className="form-label small fw-semibold text-muted text-uppercase letter-spacing">
                        Purchase Reference Code
                      </label>
                      <input
                        id="purchase-ref-code"
                        type="text"
                        className="form-control"
                        value={purchaseRef}
                        onChange={(e) => setPurchaseRef(e.target.value)}
                        required
                        aria-required="true"
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
                      {purchaseSubmitting ? 'Processing Purchase...' : 'Confirm BP Purchase'}
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
