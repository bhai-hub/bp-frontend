'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please verify your credentials.');
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
      <header className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center" role="banner">
        <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none" aria-label="Brownie Points Homepage">
          <div className="brand-icon-box" aria-hidden="true">
            BP
          </div>
          <span className="brand-title">Brownie Points</span>
        </Link>
        <Link href="/" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" aria-label="Return to homepage">
          <i className="bi bi-arrow-left" aria-hidden="true"></i> Back to Homepage
        </Link>
      </header>

      {/* Login Card Container */}
      <main id="main-content" tabIndex={-1} className="container py-5 d-flex justify-content-center align-items-center flex-grow-1">
        <div style={{ maxWidth: '460px', width: '100%' }}>
          <div className="enterprise-card p-4 p-sm-5 bg-white shadow-sm border rounded">
            <div className="text-center mb-4">
              <h1 className="fw-bold text-dark mb-1 fs-4">Enterprise Portal Sign In</h1>
              <p className="text-muted small">
                Enter your corporate credentials or select a pre-configured demo account below.
              </p>
            </div>

            {error && (
              <div
                id="login-error-msg"
                className="alert alert-danger py-2 px-3 small mb-4 d-flex align-items-center"
                role="alert"
                aria-live="assertive"
              >
                <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0" aria-hidden="true"></i>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin} noValidate={false}>
              <div className="mb-3">
                <label
                  htmlFor="login-email"
                  className="form-label small fw-semibold text-muted text-uppercase letter-spacing d-block"
                >
                  Work Email Address <span className="text-danger" aria-hidden="true">*</span>
                </label>
                <input
                  id="login-email"
                  type="email"
                  className="form-control"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-required="true"
                  aria-describedby={error ? "login-error-msg" : undefined}
                  autoComplete="email"
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label
                    htmlFor="login-password"
                    className="form-label small fw-semibold text-muted text-uppercase letter-spacing mb-0"
                  >
                    Password <span className="text-danger" aria-hidden="true">*</span>
                  </label>
                </div>
                <div className="input-group">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-required="true"
                    aria-describedby={error ? "login-error-msg" : undefined}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-medium"
                disabled={isSubmitting}
                aria-label={isSubmitting ? 'Signing in, please wait...' : 'Sign in to dashboard'}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* Quick-fill Demo Personas */}
            <div className="mt-4 pt-3 border-top">
              <div className="text-center mb-3">
                <span className="small text-muted fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>
                  Quick-Fill Demo Credentials
                </span>
              </div>
              <div className="d-flex flex-column gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('superadmin@browniepoints.com', 'Admin@123456')}
                  className="btn btn-sm btn-outline-secondary d-flex justify-content-between align-items-center text-start p-2"
                  aria-label="Use Super Admin demo credentials: superadmin@browniepoints.com"
                >
                  <div>
                    <span className="fw-semibold text-dark d-block">Super Admin</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                      superadmin@browniepoints.com
                    </span>
                  </div>
                  <i className="bi bi-shield-lock text-primary fs-5" aria-hidden="true"></i>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('hr@acme.com', 'Hr@123456')}
                  className="btn btn-sm btn-outline-secondary d-flex justify-content-between align-items-center text-start p-2"
                  aria-label="Use HR Manager demo credentials: hr@acme.com"
                >
                  <div>
                    <span className="fw-semibold text-dark d-block">HR Manager (Acme Tech)</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                      hr@acme.com
                    </span>
                  </div>
                  <i className="bi bi-people text-success fs-5" aria-hidden="true"></i>
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('alex.miller@acme.com', 'Employee@123')}
                  className="btn btn-sm btn-outline-secondary d-flex justify-content-between align-items-center text-start p-2"
                  aria-label="Use Employee demo credentials: alex.miller@acme.com"
                >
                  <div>
                    <span className="fw-semibold text-dark d-block">Employee (Alex Miller)</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>
                      alex.miller@acme.com
                    </span>
                  </div>
                  <i className="bi bi-person text-info fs-5" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="py-3 text-center text-muted small border-top bg-white" role="contentinfo">
        Brownie Points Enterprise Infrastructure &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
