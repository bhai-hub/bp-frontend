'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import OnboardingGuard from '../../../components/OnboardingGuard';
import api from '../../../lib/api';
import { IkigaiDimension } from '../../../types';

interface DimensionMeta {
  key: IkigaiDimension;
  title: string;
  subtitle: string;
  icon: string;
  badgeClass: string;
}

const DIMENSIONS: DimensionMeta[] = [
  {
    key: 'LOVE',
    title: 'What You Love',
    subtitle: 'Activities and topics that inspire deep engagement and passion',
    icon: 'bi-heart-fill',
    badgeClass: 'bg-danger-subtle text-danger border-danger-subtle',
  },
  {
    key: 'GOOD_AT',
    title: 'What You Are Good At',
    subtitle: 'Core competencies, analytical skills, and domain mastery',
    icon: 'bi-lightning-charge-fill',
    badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
  },
  {
    key: 'WORLD_NEEDS',
    title: 'What The World Needs',
    subtitle: 'Organizational goals, team mission, and customer value created',
    icon: 'bi-globe-americas',
    badgeClass: 'bg-success-subtle text-success border-success-subtle',
  },
  {
    key: 'PAID_FOR',
    title: 'What You Can Be Paid For',
    subtitle: 'Professional capabilities, business deliverables, and market rewards',
    icon: 'bi-cash-coin',
    badgeClass: 'bg-warning-subtle text-warning border-warning-subtle',
  },
];

export default function EmployeeIkigaiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/ikigai/me');
      if (res.data.success) {
        setData(res.data.data);
        const map: Record<string, string> = {};
        res.data.data.responses.forEach((r: any) => {
          map[r.questionId] = r.response;
        });
        setEditValues(map);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load Ikigai reflections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const formatted = Object.entries(editValues).map(([questionId, response]) => {
      const respObj = data?.responses?.find((r: any) => r.questionId === questionId);
      return {
        questionId,
        dimension: respObj?.dimension || 'LOVE',
        response,
      };
    });

    try {
      const res = await api.put('/ikigai/responses', { responses: formatted });
      if (res.data.success) {
        setSuccess('Your Ikigai reflections have been updated successfully.');
        setIsEditing(false);
        fetchResponses();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save reflections');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <OnboardingGuard>
        <DashboardLayout allowedRoles={['EMPLOYEE']}>
          {/* Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <div>
              <h4 className="fw-bold text-dark mb-1">My Professional Ikigai</h4>
              <p className="text-muted small mb-0">
                Personal purpose reflections aligned with your enterprise career journey.
              </p>
            </div>

            <div className="d-flex gap-2">
              <Link href="/employee" className="btn btn-outline-secondary btn-sm">
                <i className="bi bi-arrow-left me-1"></i> Dashboard
              </Link>
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn btn-primary btn-sm">
                  <i className="bi bi-pencil-square me-1"></i> Edit Reflections
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)} className="btn btn-outline-secondary btn-sm">
                  Cancel Editing
                </button>
              )}
            </div>
          </div>

          {/* Guarantee Callout */}
          <div className="alert alert-light border py-3 px-3 mb-4 small">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-shield-lock-fill text-success fs-5"></i>
              <div>
                <strong className="text-dark">Private &amp; Non-Evaluative:</strong> Your responses are confidential. Brownie Points guarantees that Ikigai reflections are strictly non-scored, decoupled from performance ranking algorithms, and never shared on public feeds.
              </div>
            </div>
          </div>

          {success && (
            <div className="alert alert-success py-2 px-3 small mb-4 alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle-fill me-2" aria-hidden="true"></i> {success}
              <button type="button" className="btn-close" aria-label="Dismiss alert" onClick={() => setSuccess(null)}></button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2" aria-hidden="true"></i> {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="row g-4">
                {DIMENSIONS.map((dim) => {
                  const dimResponses = data?.dimensions?.[dim.key] || [];

                  return (
                    <div key={dim.key} className="col-md-6">
                      <div className="enterprise-card h-100">
                        <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <i className={`bi ${dim.icon}`} aria-hidden="true"></i>
                            <span className="fw-bold">{dim.title}</span>
                          </div>
                          <span className={`badge border ${dim.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                            {dim.key}
                          </span>
                        </div>

                        <div className="p-4">
                          <p className="text-muted small mb-3">{dim.subtitle}</p>

                          {dimResponses.length === 0 ? (
                            <p className="text-muted small fst-italic">No reflections recorded for this dimension.</p>
                          ) : (
                            <div className="d-flex flex-column gap-3">
                              {dimResponses.map((r: any) => (
                                <div key={r.id} className="p-3 bg-light border">
                                  <label htmlFor={`ikigai-${r.questionId}`} className="form-label small fw-semibold text-dark mb-1 d-block">
                                    {r.question?.questionText || 'Reflection Prompt'}
                                  </label>
                                  {isEditing ? (
                                    <textarea
                                      id={`ikigai-${r.questionId}`}
                                      className="form-control form-control-sm bg-white"
                                      rows={2}
                                      value={editValues[r.questionId] || ''}
                                      onChange={(e) =>
                                        setEditValues({
                                          ...editValues,
                                          [r.questionId]: e.target.value,
                                        })
                                      }
                                    />
                                  ) : (
                                    <div className="small text-muted">{r.response}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {isEditing && (
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                    {saving ? 'Saving Changes...' : 'Save Reflections'}
                  </button>
                </div>
              )}
            </form>
          )}
        </DashboardLayout>
      </OnboardingGuard>
    </ProtectedRoute>
  );
}
