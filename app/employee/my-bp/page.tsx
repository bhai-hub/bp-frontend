'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import StatCard from '../../../components/StatCard';
import api from '../../../lib/api';

export default function EmployeeMyBpPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/employees/me');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load wallet');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWallet();
  }, []);

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <DashboardLayout allowedRoles={['EMPLOYEE']}>
        <div className="mb-4">
          <h4 className="fw-bold text-dark mb-1">My Brownie Points Wallet</h4>
          <p className="text-muted small mb-0">
            Authoritative logical separation of your earned company recognition currency.
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
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <StatCard
                  label="Spendable Balance"
                  value={`${(data?.wallet?.spendableBalance || 0).toLocaleString()} BP`}
                  icon="bi-wallet-fill"
                  badge={{ text: 'Liquid', variant: 'success' }}
                  subtext="Immediately accessible for redemptions"
                />
              </div>

              <div className="col-md-4">
                <StatCard
                  label="Loyalty Balance"
                  value={`${(data?.wallet?.loyaltyBalance || 0).toLocaleString()} BP`}
                  icon="bi-shield-lock-fill"
                  badge={{ text: 'Tenure Locked', variant: 'warning' }}
                  subtext="Unlocks on annual work milestone"
                />
              </div>

              <div className="col-md-4">
                <StatCard
                  label="Lifetime Career Score"
                  value={`${(data?.wallet?.lifetimeBalance || 0).toLocaleString()} BP`}
                  icon="bi-trophy-fill"
                  badge={{ text: 'Cumulative', variant: 'blue' }}
                  subtext="Never decreases upon redemptions"
                />
              </div>
            </div>

            <div className="row g-4">
              <div className="col-lg-6">
                <div className="enterprise-card h-100">
                  <div className="enterprise-card-header">
                    <span>Wallet Architecture & Rules</span>
                  </div>
                  <div className="p-4 d-flex flex-column gap-3 small">
                    <div className="border-bottom pb-2">
                      <div className="fw-bold text-dark">One Unified BP Currency</div>
                      <div className="text-muted">
                        All recognition is denominated in standard Brownie Points (BP). There are no secondary tokens or volatile exchange rates.
                      </div>
                    </div>

                    <div className="border-bottom pb-2">
                      <div className="fw-bold text-dark">Spendable vs. Lifetime Distinction</div>
                      <div className="text-muted">
                        When you spend points on perks or awards, only your <strong>Spendable Balance</strong> decreases. Your <strong>Lifetime Career Score</strong> remains intact as permanent proof of your cumulative impact.
                      </div>
                    </div>

                    <div>
                      <div className="fw-bold text-dark">Authoritative Backend Validation</div>
                      <div className="text-muted">
                        Wallet balances are maintained directly in the enterprise PostgreSQL database with strict transactional ledgering.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="enterprise-card h-100">
                  <div className="enterprise-card-header">
                    <span>Upcoming Milestone & Redemption Program</span>
                  </div>
                  <div className="p-4">
                    <div className="alert alert-info py-2 px-3 small mb-3 border">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Redemption catalog (Day 4 engine) connects your spendable points to digital gift cards, travel stipends, and learning credits.
                    </div>

                    <div className="p-3 bg-light border">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-semibold text-dark small">Next Loyalty Unlock</span>
                        <span className="badge bg-white text-dark border small">Work Anniversary</span>
                      </div>
                      <div className="text-muted small">
                        {(data?.wallet?.loyaltyBalance || 0).toLocaleString()} Loyalty BP will transfer to your spendable wallet upon reaching your tenure anniversary.
                      </div>
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
