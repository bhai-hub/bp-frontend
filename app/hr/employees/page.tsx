'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import api from '../../../lib/api';
import { Employee } from '../../../types';

export default function HrEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [orgBP, setOrgBP] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Add Employee Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [empForm, setEmpForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    employeeCode: '',
    department: '',
    designation: '',
    password: 'Employee@123',
  });
  const [addLoading, setAddLoading] = useState(false);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [invitationModal, setInvitationModal] = useState<{
    show: boolean;
    email: string;
    employeeName: string;
    token: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Credit BP Modal
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [creditAmount, setCreditAmount] = useState(1000);
  const [creditReason, setCreditReason] = useState('Outstanding performance milestone');
  const [creditLoading, setCreditLoading] = useState(false);

  const fetchEmployeesAndOrg = async () => {
    try {
      setIsLoading(true);
      const [empRes, dashRes] = await Promise.all([
        api.get('/hr/employees'),
        api.get('/hr/dashboard'),
      ]);

      if (empRes.data.success) {
        setEmployees(empRes.data.data);
      }
      if (dashRes.data.success) {
        setOrgBP(dashRes.data.data.metrics.bpAvailable || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesAndOrg();
  }, []);

  const handleToggleStatus = async (employeeId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      setError(null);
      const res = await api.patch(`/hr/employees/${employeeId}/status`, {
        status: nextStatus,
      });
      if (res.data.success) {
        setSuccess(`Employee status updated to ${nextStatus}`);
        fetchEmployeesAndOrg();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update employee status');
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setError(null);

    try {
      const res = await api.post('/hr/employees', empForm);
      if (res.data.success) {
        const token = res.data.data?.invitationToken;
        setSuccess(`Employee ${empForm.firstName} ${empForm.lastName} onboarded with wallet!`);
        setShowAddModal(false);
        if (token) {
          setInvitationModal({
            show: true,
            email: empForm.email,
            employeeName: `${empForm.firstName} ${empForm.lastName}`,
            token,
          });
        }
        setEmpForm({
          firstName: '',
          lastName: '',
          email: '',
          employeeCode: '',
          department: '',
          designation: '',
          password: 'Employee@123',
        });
        fetchEmployeesAndOrg();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to add employee');
    } finally {
      setAddLoading(false);
    }
  };

  const handleResendInvitation = async (emp: Employee) => {
    try {
      setResendingId(emp.id);
      setError(null);
      const res = await api.post(`/hr/employees/${emp.id}/resend-invitation`);
      if (res.data.success) {
        setInvitationModal({
          show: true,
          email: emp.user.email,
          employeeName: `${emp.user.firstName} ${emp.user.lastName}`,
          token: res.data.data.invitationToken,
        });
        setSuccess(`New single-use invitation generated for ${emp.user.firstName} ${emp.user.lastName}`);
        fetchEmployeesAndOrg();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend invitation');
    } finally {
      setResendingId(null);
    }
  };

  const renderOnboardingBadge = (status?: string) => {
    switch (status) {
      case 'INVITED':
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle py-1 px-2" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-envelope me-1"></i> Invited
          </span>
        );
      case 'ACCOUNT_CREATED':
      case 'PROFILE_PENDING':
        return (
          <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle py-1 px-2" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-person-badge me-1"></i> Profile Pending
          </span>
        );
      case 'IKIGAI_PENDING':
        return (
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-compass me-1"></i> Ikigai Pending
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle py-1 px-2" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-check2-circle me-1"></i> Completed
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle py-1 px-2" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-dash-circle me-1"></i> Suspended
          </span>
        );
      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle py-1 px-2" style={{ fontSize: '0.72rem' }}>
            {status || 'Pending'}
          </span>
        );
    }
  };

  const handleOpenCreditModal = (emp: Employee) => {
    setSelectedEmp(emp);
    setCreditAmount(1000);
    setCreditReason('Outstanding sprint delivery & team mentorship');
    setShowCreditModal(true);
  };

  const handleExecuteCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    if (creditAmount > orgBP) {
      setError(`Cannot credit ${creditAmount} BP: Organization only has ${orgBP.toLocaleString()} available BP.`);
      return;
    }

    setCreditLoading(true);
    setError(null);

    try {
      const res = await api.post(`/hr/employees/${selectedEmp.id}/bp-credit`, {
        amount: Number(creditAmount),
        reason: creditReason,
      });

      if (res.data.success) {
        setSuccess(
          `Successfully credited ${creditAmount.toLocaleString()} BP to ${selectedEmp.user.firstName} ${selectedEmp.user.lastName}!`,
        );
        setShowCreditModal(false);
        fetchEmployeesAndOrg();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to credit Brownie Points');
    } finally {
      setCreditLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['HR_MANAGER']}>
      <DashboardLayout allowedRoles={['HR_MANAGER']}>
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold text-dark mb-1">Employee Directory & Wallets</h4>
            <p className="text-muted small mb-0">
              Manage staff profiles, monitor individual BP wallets, and issue recognition points.
            </p>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="border bg-white px-3 py-1 text-end">
              <span className="text-muted small d-block" style={{ fontSize: '0.7rem' }}>
                Org Available BP
              </span>
              <span className="fw-bold text-primary">{orgBP.toLocaleString()} BP</span>
            </div>
            <button
              onClick={() => {
                setEmpForm({
                  ...empForm,
                  employeeCode: `EMP-${Math.floor(100 + Math.random() * 900)}`,
                });
                setShowAddModal(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <i className="bi bi-person-plus me-1"></i> Add Employee
            </button>
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

        {/* Employees Table */}
        <div className="enterprise-card">
          <div className="table-responsive">
            <table className="enterprise-table">
              <thead>
                <tr>
                  <th scope="col">Code</th>
                  <th scope="col">Employee Name</th>
                  <th scope="col">Department & Role</th>
                  <th scope="col">Account</th>
                  <th scope="col">Onboarding</th>
                  <th scope="col">Spendable BP</th>
                  <th scope="col">Lifetime BP</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Loading employees...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No employees registered in this organization yet.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id}>
                      <td><code>{emp.employeeCode}</code></td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {emp.user.firstName} {emp.user.lastName}
                        </div>
                        <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                          {emp.user.email}
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{emp.department}</div>
                        <div className="text-muted small">{emp.designation}</div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(emp.id, emp.status)}
                          className="btn p-0 border-0"
                          title="Click to toggle active/inactive"
                          aria-label={`Toggle active status for ${emp.user.firstName} ${emp.user.lastName}, currently ${emp.status}`}
                        >
                          <span
                            className={`enterprise-badge enterprise-badge-${
                              emp.status === 'ACTIVE' ? 'active' : 'inactive'
                            }`}
                          >
                            {emp.status}
                          </span>
                        </button>
                      </td>
                      <td>
                        {renderOnboardingBadge(emp.onboardingStatus)}
                      </td>
                      <td className="fw-bold text-primary">
                        {(emp.wallet?.spendableBalance || 0).toLocaleString()} BP
                      </td>
                      <td className="fw-semibold text-dark">
                        {(emp.wallet?.lifetimeBalance || 0).toLocaleString()} BP
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <button
                            onClick={() => handleOpenCreditModal(emp)}
                            className="btn btn-sm btn-outline-primary py-1 px-2"
                            disabled={emp.status !== 'ACTIVE'}
                            title={emp.status !== 'ACTIVE' ? 'Cannot credit inactive employee' : 'Credit BP'}
                            aria-label={`Credit Brownie Points to ${emp.user.firstName} ${emp.user.lastName}`}
                          >
                            <i className="bi bi-award me-1" aria-hidden="true"></i> Credit BP
                          </button>
                          {emp.onboardingStatus !== 'COMPLETED' && (
                            <button
                              onClick={() => handleResendInvitation(emp)}
                              className="btn btn-sm btn-outline-secondary py-1 px-2"
                              disabled={resendingId === emp.id}
                              title="Resend single-use onboarding invitation link"
                              aria-label={`Resend invitation link to ${emp.user.firstName} ${emp.user.lastName}`}
                            >
                              {resendingId === emp.id ? (
                                <span className="spinner-border spinner-border-sm" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </span>
                              ) : (
                                <>
                                  <i className="bi bi-envelope-arrow-up me-1" aria-hidden="true"></i> Invite
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Credit BP Modal */}
        {showCreditModal && selectedEmp && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="credit-bp-modal-title"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 id="credit-bp-modal-title" className="modal-title fw-bold mb-0">
                    Credit Brownie Points to {selectedEmp.user.firstName} {selectedEmp.user.lastName}
                  </h6>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close dialog"
                    onClick={() => setShowCreditModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleExecuteCredit}>
                  <div className="modal-body p-4">
                    <div className="p-3 bg-light border mb-3">
                      <div className="d-flex justify-content-between small text-muted">
                        <span>Recipient Code:</span>
                        <span className="fw-bold text-dark">{selectedEmp.employeeCode}</span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mt-1">
                        <span>Current Spendable Balance:</span>
                        <span className="fw-bold text-primary">
                          {(selectedEmp.wallet?.spendableBalance || 0).toLocaleString()} BP
                        </span>
                      </div>
                      <div className="d-flex justify-content-between small text-muted mt-1">
                        <span>Company Available BP:</span>
                        <span className="fw-bold text-dark">{orgBP.toLocaleString()} BP</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="credit-amount-input" className="form-label small fw-semibold text-muted text-uppercase">
                        Brownie Points Amount
                      </label>
                      <input
                        id="credit-amount-input"
                        type="number"
                        min="1"
                        max={orgBP}
                        step="50"
                        className="form-control"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(Number(e.target.value))}
                        required
                        aria-required="true"
                      />
                      <div className="form-text small">
                        Deducted from company available reserve and credited to employee spendable & lifetime balances.
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="credit-reason-input" className="form-label small fw-semibold text-muted text-uppercase">
                        Recognition Rationale / Reason
                      </label>
                      <input
                        id="credit-reason-input"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Critical production release lead & mentoring junior engineers"
                        value={creditReason}
                        onChange={(e) => setCreditReason(e.target.value)}
                        required
                        aria-required="true"
                      />
                    </div>
                  </div>

                  <div className="modal-footer p-3 bg-light border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowCreditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary"
                      disabled={creditLoading || creditAmount <= 0 || creditAmount > orgBP}
                    >
                      {creditLoading ? 'Crediting Points...' : `Confirm Credit (+${creditAmount.toLocaleString()} BP)`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
        {showAddModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-emp-modal-title"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <h6 id="add-emp-modal-title" className="modal-title fw-bold mb-0">Onboard New Employee</h6>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close dialog"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleAddEmployee}>
                  <div className="modal-body p-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="add-emp-first-name" className="form-label small fw-semibold text-muted text-uppercase">First Name</label>
                        <input
                          id="add-emp-first-name"
                          type="text"
                          className="form-control"
                          value={empForm.firstName}
                          onChange={(e) => setEmpForm({ ...empForm, firstName: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="add-emp-last-name" className="form-label small fw-semibold text-muted text-uppercase">Last Name</label>
                        <input
                          id="add-emp-last-name"
                          type="text"
                          className="form-control"
                          value={empForm.lastName}
                          onChange={(e) => setEmpForm({ ...empForm, lastName: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="add-emp-email" className="form-label small fw-semibold text-muted text-uppercase">Corporate Email</label>
                        <input
                          id="add-emp-email"
                          type="email"
                          className="form-control"
                          placeholder="employee@company.com"
                          value={empForm.email}
                          onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="add-emp-code" className="form-label small fw-semibold text-muted text-uppercase">Employee ID Code</label>
                        <input
                          id="add-emp-code"
                          type="text"
                          className="form-control"
                          value={empForm.employeeCode}
                          onChange={(e) => setEmpForm({ ...empForm, employeeCode: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="add-emp-dept" className="form-label small fw-semibold text-muted text-uppercase">Department</label>
                        <input
                          id="add-emp-dept"
                          type="text"
                          className="form-control"
                          placeholder="Engineering, Sales, etc."
                          value={empForm.department}
                          onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>

                      <div className="col-12">
                        <label htmlFor="add-emp-title" className="form-label small fw-semibold text-muted text-uppercase">Designation / Title</label>
                        <input
                          id="add-emp-title"
                          type="text"
                          className="form-control"
                          placeholder="Senior Software Engineer"
                          value={empForm.designation}
                          onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                          required
                          aria-required="true"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer p-3 bg-light border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary" disabled={addLoading}>
                      {addLoading ? 'Onboarding...' : 'Onboard Employee'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Invitation Link Modal */}
        {invitationModal && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="invitation-modal-title"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content enterprise-card">
                <div className="modal-header enterprise-card-header">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-envelope-check-fill text-success fs-5" aria-hidden="true"></i>
                    <h6 id="invitation-modal-title" className="modal-title fw-bold mb-0">Onboarding Invitation Link</h6>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close dialog"
                    onClick={() => {
                      setInvitationModal(null);
                      setCopied(false);
                    }}
                  ></button>
                </div>
                <div className="modal-body p-4">
                  <p className="text-muted small mb-3">
                    A single-use, 7-day cryptographic onboarding invitation has been issued for{' '}
                    <strong className="text-dark">{invitationModal.employeeName}</strong> (
                    <code>{invitationModal.email}</code>).
                  </p>

                  <label htmlFor="invitation-direct-link" className="form-label small fw-semibold text-muted text-uppercase">
                    Direct Invitation Link
                  </label>
                  <div className="input-group mb-3">
                    <input
                      id="invitation-direct-link"
                      type="text"
                      className="form-control font-monospace small"
                      readOnly
                      value={
                        typeof window !== 'undefined'
                          ? `${window.location.origin}/onboarding/invitation/${invitationModal.token}`
                          : `/onboarding/invitation/${invitationModal.token}`
                      }
                    />
                    <button
                      className={`btn ${copied ? 'btn-success' : 'btn-outline-primary'}`}
                      type="button"
                      aria-label={copied ? 'Invitation link copied to clipboard' : 'Copy invitation link to clipboard'}
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/onboarding/invitation/${invitationModal.token}`,
                          );
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2500);
                        }
                      }}
                    >
                      <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'} me-1`} aria-hidden="true"></i>
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>

                  <div className="p-3 bg-light border">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-shield-lock-fill text-primary mt-1" aria-hidden="true"></i>
                      <div className="small text-muted" style={{ fontSize: '0.8rem' }}>
                        <strong className="text-dark d-block mb-1">Cryptographic Token Security</strong>
                        Only the SHA-256 hash of this invitation token is stored in the database. Send this private link directly to the employee to activate their account.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer p-3 bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setInvitationModal(null);
                      setCopied(false);
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
