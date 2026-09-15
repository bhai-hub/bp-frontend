'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { BPTransaction } from '../../../types';

export default function HrBpActivityPage() {
  const [transactions, setTransactions] = useState<BPTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/hr/bp-activity');
        if (res.data.success) {
          setTransactions(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load BP activity');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['HR_MANAGER']}>
      <DashboardLayout allowedRoles={['HR_MANAGER']}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-1">Organization BP Activity Ledger</h4>
            <p className="text-muted small mb-0">
              Audit-compliant ledger of all Brownie Points allocations, credits, and organizational adjustments.
            </p>
          </div>
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
                  <th>Timestamp</th>
                  <th>Transaction Type</th>
                  <th>Reference Code</th>
                  <th>Recipient Employee</th>
                  <th>Recognition Reason</th>
                  <th className="text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading ledger entries...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-muted">
                      No activity records found.
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
                      <td>
                        {tx.employee ? (
                          <div>
                            <span className="fw-semibold text-dark">
                              {tx.employee.user.firstName} {tx.employee.user.lastName}
                            </span>
                            <span className="text-muted d-block small" style={{ fontSize: '0.72rem' }}>
                              {tx.employee.user.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted">Company Treasury</span>
                        )}
                      </td>
                      <td className="small">{tx.description}</td>
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
      </DashboardLayout>
    </ProtectedRoute>
  );
}
