'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

export default function EmployeeProfilePage() {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/employees/me');
      if (res.data.success) {
        setData(res.data.data);
        setFirstName(res.data.data.employee?.user?.firstName || '');
        setLastName(res.data.data.employee?.user?.lastName || '');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await api.patch('/employees/me', { firstName, lastName });
      if (res.data.success) {
        setSuccess('Profile updated successfully!');
        await refreshUser();
        fetchProfile();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <DashboardLayout allowedRoles={['EMPLOYEE']}>
        <div className="mb-4">
          <h4 className="fw-bold text-dark mb-1">Employee Profile</h4>
          <p className="text-muted small mb-0">
            View enterprise employment metadata and update your contact name.
          </p>
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
                  <span>Employment Metadata</span>
                </div>
                <div className="p-4">
                  <div className="row g-3 small">
                    <div className="col-6">
                      <span className="text-muted d-block">Employee ID Code</span>
                      <code>{data?.employee?.employeeCode}</code>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Department</span>
                      <span className="fw-semibold text-dark">{data?.employee?.department}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Designation</span>
                      <span className="fw-semibold text-dark">{data?.employee?.designation}</span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Employment Status</span>
                      <span className="enterprise-badge enterprise-badge-active">
                        {data?.employee?.status}
                      </span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Assigned Organization</span>
                      <span className="fw-semibold text-dark">
                        {data?.employee?.organization?.name}
                      </span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block">Joining Date</span>
                      <span className="fw-semibold text-dark">
                        {data?.employee?.joiningDate
                          ? new Date(data.employee.joiningDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="col-12">
                      <span className="text-muted d-block">Official Work Email</span>
                      <span className="fw-semibold text-dark">{data?.employee?.user?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="enterprise-card h-100">
                <div className="enterprise-card-header">
                  <span>Edit Personal Details</span>
                </div>
                <div className="p-4">
                  <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                      <label htmlFor="profile-first-name" className="form-label small fw-semibold text-muted text-uppercase">
                        First Name
                      </label>
                      <input
                        id="profile-first-name"
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="profile-last-name" className="form-label small fw-semibold text-muted text-uppercase">
                        Last Name
                      </label>
                      <input
                        id="profile-last-name"
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-sm px-3"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Save Profile Changes'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
