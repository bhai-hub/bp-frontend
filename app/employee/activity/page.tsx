'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { BPTransaction } from '../../../types';

export default function EmployeeActivityPage() {
  const [activity, setActivity] = useState<BPTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/employees/me/activity');
        if (res.data.success) {
          setActivity(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load activity history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <DashboardLayout allowedRoles={['EMPLOYEE']}>
        <div className="mb-4">
          <h4 className="fw-bold text-dark mb-1">My Recognition Activity History</h4>
          <p className="text-muted small mb-0">
            Chronological audit record of every Brownie Points recognition award credited to your profile.
          </p>
        </div>

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
                  <th>Date & Time</th>
                  <th>Award Description & Recognition Rationale</th>
                  <th>Ledger Reference</th>
                  <th className="text-end">Points Awarded</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading personal activity...
                    </td>
                  </tr>
                ) : activity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-muted">
                      No points transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  activity.map((tx) => (
                    <tr key={tx.id}>
                      <td className="small text-muted">
                        {new Date(tx.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{tx.description}</div>
                        <span className="badge bg-light text-dark border mt-1" style={{ fontSize: '0.7rem' }}>
                          {tx.type}
                        </span>
                      </td>
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
