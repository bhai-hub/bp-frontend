'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import StatCard from '../../components/StatCard';
import api from '../../lib/api';

export default function HrDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHrDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/hr/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load HR dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHrDashboard();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['HR_MANAGER']}>
      <DashboardLayout allowedRoles={['HR_MANAGER']}>
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2">
              <h4 className="fw-bold text-dark mb-0">
                {data?.organization?.name || 'Organization'} HR Operations
              </h4>
              <span className="enterprise-badge enterprise-badge-active">
                {data?.organization?.status || 'ACTIVE'}
              </span>
            </div>
            <p className="text-muted small mb-0 mt-1">
              Employee workforce administration, Brownie Points allocations, and recognition ledgers.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Link href="/hr/employees" className="btn btn-primary btn-sm">
              <i className="bi bi-award me-1"></i> Credit BP to Employees
            </Link>
            <Link href="/hr/employees" className="btn btn-outline-secondary btn-sm">
              <i className="bi bi-person-plus me-1"></i> Add Employee
            </Link>
          </div>
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
          <>
            {/* KPI Cards */}
            <div className="row g-3 mb-4">
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="Total Employees"
                  value={data?.metrics?.totalEmployees || 0}
                  icon="bi-people"
                  subtext="Registered staff"
                />
              </div>
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="Active Employees"
                  value={data?.metrics?.activeEmployees || 0}
                  icon="bi-person-check"
                  badge={{ text: 'Eligible for BP', variant: 'success' }}
                />
              </div>
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="BP Available Pool"
                  value={`${(data?.metrics?.bpAvailable || 0).toLocaleString()} BP`}
                  icon="bi-wallet2"
                  badge={{ text: 'Available', variant: 'info' }}
                  subtext="For employee credits"
                />
              </div>
              <div className="col-xl-3 col-sm-6">
                <StatCard
                  label="BP Allocated"
                  value={`${(data?.metrics?.bpAllocated || 0).toLocaleString()} BP`}
                  icon="bi-award"
                  subtext="Total lifetime disbursed"
                />
              </div>
            </div>

            <div className="row g-4">
              {/* Recent Activity Ledger */}
              <div className="col-lg-8">
                <div className="enterprise-card">
                  <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                    <span>Recent BP Transactions</span>
                    <Link href="/hr/bp-activity" className="text-decoration-none small">
                      View All Ledger <i className="bi bi-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </div>
                  <div className="table-responsive">
                    <table className="enterprise-table">
                      <thead>
                        <tr>
                          <th scope="col">Date / Time</th>
                          <th scope="col">Recipient</th>
                          <th scope="col">Reason / Description</th>
                          <th scope="col">Reference</th>
                          <th scope="col" className="text-end">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.recentActivity?.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-4 text-muted">
                              No recent recognition transactions.
                            </td>
                          </tr>
                        ) : (
                          data?.recentActivity?.map((tx: any) => (
                            <tr key={tx.id}>
                              <td className="small text-muted">
                                {new Date(tx.createdAt).toLocaleDateString()}
                              </td>
                              <td>
                                {tx.employee ? (
                                  <div className="fw-semibold text-dark">
                                    {tx.employee.user.firstName} {tx.employee.user.lastName}
                                  </div>
                                ) : (
                                  <span className="text-muted">Company Treasury</span>
                                )}
                              </td>
                              <td className="small">{tx.description}</td>
                              <td><code>{tx.reference}</code></td>
                              <td className="text-end fw-bold text-primary">
                                +{tx.amount.toLocaleString()} BP
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Organization Quick Info */}
              <div className="col-lg-4">
                <div className="enterprise-card h-100">
                  <div className="enterprise-card-header">
                    <span>Organization Overview</span>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <span className="text-muted small d-block">Entity Name</span>
                      <span className="fw-bold text-dark">{data?.organization?.name}</span>
                      <div className="text-muted small">{data?.organization?.legalName}</div>
                    </div>

                    <div className="mb-3">
                      <span className="text-muted small d-block">Accounting Currency</span>
                      <span className="fw-semibold text-dark">{data?.organization?.currency}</span>
                    </div>

                    <div className="mb-3">
                      <span className="text-muted small d-block">Monthly Cap Policy</span>
                      <span className="fw-semibold text-dark">
                        {data?.organization?.bpPolicy?.monthlyCapPerEmployee?.toLocaleString() || '10,000'} BP / employee
                      </span>
                    </div>

                    <div className="border-top pt-3 mt-3">
                      <Link href="/hr/organization" className="btn btn-sm btn-outline-primary w-100">
                        View Organization Settings
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
