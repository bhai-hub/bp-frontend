'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const user = await login(email, password);
      if (user.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else if (user.role === 'HR_MANAGER') {
        router.push('/hr');
      } else {
        router.push('/employee');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column justify-content-between">
      {/* Top Brand bar */}
      <header className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
        <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div className="brand-icon-box">
            BP
          </div>
          <span className="brand-title">Brownie Points</span>
        </Link>
        <Link href="/" className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Back to Homepage
        </Link>
      </header>

      {/* Login Card Container */}
      <main className="container py-5 d-flex justify-content-center align-items-center flex-grow-1">
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div className="enterprise-card p-4 p-sm-5 bg-white shadow-sm">
            <div className="text-center mb-4">
              <h4 className="fw-bold text-dark mb-1">Enterprise Portal Sign In</h4>
              <p className="text-muted small">
                Enter your corporate credentials or choose a pre-configured demo account below.
              </p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted text-uppercase letter-spacing">
                  Work Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold text-muted text-uppercase letter-spacing mb-0">
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing In...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* Quick-fill Demo Personas */}
            <div className="mt-4 pt-3 border-top">
              <div className="text-center mb-3">
                <span className="small text-muted fw-semibold text-uppercase" style={{ fontSize: '0.72rem' }}>
                  Quick-Fill Demo Credentials
                </span>
              </div>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('superadmin@browniepoints.com', 'Admin@123456')}
                  className="btn btn-sm btn-outline-secondary d-flex justify-content-between align-items-center text-start"
                >
                  <div>
                    <span className="fw-semibold text-dark">Super Admin</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
                      superadmin@browniepoints.com
                    </span>
                  </div>
                  <i className="bi bi-shield-lock text-primary"></i>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('hr@acme.com', 'Hr@123456')}
                  className="btn btn-sm btn-outline-secondary d-flex justify-content-between align-items-center text-start"
                >
                  <div>
                    <span className="fw-semibold text-dark">HR Manager (Acme Tech)</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
                      hr@acme.com
                    </span>
                  </div>
                  <i className="bi bi-people text-success"></i>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('alex.miller@acme.com', 'Employee@123')}
                  className="btn btn-sm btn-outline-secondary d-flex justify-content-between align-items-center text-start"
                >
                  <div>
                    <span className="fw-semibold text-dark">Employee (Alex Miller)</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.72rem' }}>
                      alex.miller@acme.com
                    </span>
                  </div>
                  <i className="bi bi-person text-info"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="py-3 text-center text-muted small border-top bg-white">
        Brownie Points Enterprise Infrastructure &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
