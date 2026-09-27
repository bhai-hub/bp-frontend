'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import ProtectedRoute from '../../components/ProtectedRoute';
import OnboardingGuard from '../../components/OnboardingGuard';
import StatCard from '../../components/StatCard';
import api from '../../lib/api';

export default function EmployeeDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployeeMe = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/employees/me');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load employee profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeMe();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <OnboardingGuard>
        <DashboardLayout allowedRoles={['EMPLOYEE']}>
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">
                Welcome back, {data?.employee?.user?.firstName || 'Colleague'}!
              </h4>
              <p className="text-muted small mb-0">
                {data?.employee?.designation} &bull; {data?.employee?.department} &bull; ID: <code>{data?.employee?.employeeCode}</code>
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link href="/employee/ikigai" className="btn btn-outline-primary btn-sm">
                <i className="bi bi-compass me-1" aria-hidden="true"></i> My Ikigai
              </Link>
              <Link href="/employee/my-bp" className="btn btn-primary btn-sm">
                <i className="bi bi-wallet2 me-1" aria-hidden="true"></i> View Wallet Details
              </Link>
              <Link href="/employee/profile" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-person me-1" aria-hidden="true"></i> My Profile
              </Link>
            </div>
          </div>

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
            {/* 3 Wallet Balance Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <StatCard
                  label="Spendable Brownie Points"
                  value={`${(data?.wallet?.spendableBalance || 0).toLocaleString()} BP`}
                  icon="bi-wallet-fill"
                  badge={{ text: 'Available Now', variant: 'success' }}
                  subtext="Redeemable for awards & corporate perks"
                />
              </div>

              <div className="col-md-4">
                <StatCard
                  label="Loyalty Brownie Points"
                  value={`${(data?.wallet?.loyaltyBalance || 0).toLocaleString()} BP`}
                  icon="bi-shield-lock-fill"
                  subtext="Vests on work anniversary"
                />
              </div>

              <div className="col-md-4">
                <StatCard
                  label="Lifetime Career Points"
                  value={`${(data?.wallet?.lifetimeBalance || 0).toLocaleString()} BP`}
                  icon="bi-trophy-fill"
                  badge={{ text: 'Career Total', variant: 'blue' }}
                  subtext="Cumulative recognition received"
                />
              </div>
            </div>

            {/* Ikigai Purpose Alignment Card */}
            <div className="enterprise-card mb-4">
              <div className="p-3 p-md-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="p-3 bg-primary-subtle text-primary rounded d-flex align-items-center justify-content-center"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <i className="bi bi-compass fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-1">Your Professional Ikigai Alignment</h6>
                      <p className="text-muted small mb-0">
                        Personal reflections across 4 core dimensions: What You Love &bull; What You Excel At &bull; Organizational Needs &bull; Market Value.
                      </p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success-subtle text-success border border-success-subtle py-2 px-3 small">
                      <i className="bi bi-shield-lock-fill me-1"></i> Private &amp; Non-Scored
                    </span>
                    <Link href="/employee/ikigai" className="btn btn-outline-primary btn-sm">
                      <i className="bi bi-pencil-square me-1"></i> Review &amp; Edit Reflections
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent BP Activity */}
            <div className="enterprise-card">
              <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                <span>Recent Brownie Points Received</span>
                <Link href="/employee/activity" className="text-decoration-none small">
                  Full History <i className="bi bi-arrow-right" aria-hidden="true"></i>
                </Link>
              </div>

              <div className="table-responsive">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th scope="col">Date Received</th>
                      <th scope="col">Award Description / Rationale</th>
                      <th scope="col">Reference</th>
                      <th scope="col" className="text-end">Points Credited</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentActivity?.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          No points transactions credited yet.
                        </td>
                      </tr>
                    ) : (
                      data?.recentActivity?.map((tx: any) => (
                        <tr key={tx.id}>
                          <td className="small text-muted">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </td>
                          <td className="fw-semibold text-dark small">{tx.description}</td>
                          <td><code>{tx.reference}</code></td>
                          <td className="text-end fw-bold text-success">
                            +{tx.amount.toLocaleString()} BP
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
        </DashboardLayout>
      </OnboardingGuard>
    </ProtectedRoute>
  );
}
