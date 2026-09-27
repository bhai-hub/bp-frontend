'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import LegalModal from '../../components/landing/LegalModal';

const countryCodes = [
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+1', flag: '🇨🇦', name: 'CA' },
  { code: '+44', flag: '🇬🇧', name: 'GB' },
  { code: '+61', flag: '🇦🇺', name: 'AU' },
  { code: '+64', flag: '🇳🇿', name: 'NZ' },
  { code: '+91', flag: '🇮🇳', name: 'IN' },
  { code: '+92', flag: '🇵🇰', name: 'PK' },
  { code: '+971', flag: '🇦🇪', name: 'AE' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+65', flag: '🇸🇬', name: 'SG' },
  { code: '+60', flag: '🇲🇾', name: 'MY' },
  { code: '+49', flag: '🇩🇪', name: 'DE' },
  { code: '+33', flag: '🇫🇷', name: 'FR' },
  { code: '+39', flag: '🇮🇹', name: 'IT' },
  { code: '+34', flag: '🇪🇸', name: 'ES' },
  { code: '+31', flag: '🇳🇱', name: 'NL' },
  { code: '+46', flag: '🇸🇪', name: 'SE' },
  { code: '+47', flag: '🇳🇴', name: 'NO' },
  { code: '+45', flag: '🇩🇰', name: 'DK' },
  { code: '+41', flag: '🇨🇭', name: 'CH' },
  { code: '+55', flag: '🇧🇷', name: 'BR' },
  { code: '+52', flag: '🇲🇽', name: 'MX' },
  { code: '+27', flag: '🇿🇦', name: 'ZA' },
  { code: '+234', flag: '🇳🇬', name: 'NG' },
  { code: '+254', flag: '🇰🇪', name: 'KE' },
  { code: '+81', flag: '🇯🇵', name: 'JP' },
  { code: '+82', flag: '🇰🇷', name: 'KR' },
  { code: '+86', flag: '🇨🇳', name: 'CN' },
];

type FormState = {
  orgName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  countryCode: string;
  phone: string;
  email: string;
  note: string;
};

const empty: FormState = {
  orgName: '',
  firstName: '',
  middleName: '',
  lastName: '',
  countryCode: '+44',
  phone: '',
  email: '',
  note: '',
};

type Modal = 'terms' | 'privacy' | null;

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [modal, setModal] = useState<Modal>(null);

  const set =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.orgName.trim()) e.orgName = 'Organisation name is required.';
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    else if (!/^\d{6,15}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a valid phone number.';
    if (!form.email.trim()) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const inputCls = (k: keyof FormState) =>
    `contact-input${errors[k] ? ' contact-input--error' : ''}`;

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <Navbar />

      <main id="main-content" tabIndex={-1} className="flex-grow-1">
        {submitted ? (
          <div className="contact-page">
            <div className="container">
              <div className="contact-success" role="status" aria-live="polite">
                <div className="contact-success__icon" aria-hidden="true">
                  <i className="bi bi-check-lg" />
                </div>
                <h1 className="contact-success__title">Request Received</h1>
                <p className="contact-success__body">
                  Thanks, <strong>{form.firstName}</strong>! We&apos;ve received your request from{' '}
                  <strong>{form.orgName}</strong>. A member of our enterprise team will reach out to{' '}
                  <strong>{form.email}</strong> within one business day.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <Link href="/" className="btn btn-primary-cta">
                    <i className="bi bi-arrow-left me-2" aria-hidden="true" />
                    Back to Home
                  </Link>
                  <button
                    type="button"
                    className="btn btn-ghost-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setForm(empty);
                    }}
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="contact-page">
            <div className="contact-hero">
              <div className="container">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Link href="/" className="contact-breadcrumb" aria-label="Return to Homepage">
                    <i className="bi bi-house me-1" aria-hidden="true" />Home
                  </Link>
                  <span className="contact-breadcrumb-sep" aria-hidden="true">/</span>
                  <span className="contact-breadcrumb contact-breadcrumb--active" aria-current="page">Contact Us</span>
                </div>
                <span className="hero-eyebrow">Get in Touch</span>
                <h1 className="contact-page-title">Request a Demo</h1>
                <p className="contact-page-subtitle">
                  Our enterprise team will reach out within one business day to schedule a personalised walkthrough.
                </p>
              </div>
            </div>

            <div className="container contact-body">
              <div className="row g-4 g-lg-5 justify-content-center">
                {/* Form */}
                <div className="col-12 col-lg-7">
                  <div className="contact-card">
                    <form onSubmit={handleSubmit} noValidate>
                      {/* Organisation */}
                      <div className="contact-field">
                        <label htmlFor="contact-orgName" className="contact-label">
                          Organisation Name <span className="text-danger" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-orgName"
                          type="text"
                          className={inputCls('orgName')}
                          placeholder="Acme Corporation"
                          value={form.orgName}
                          onChange={set('orgName')}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.orgName}
                          aria-describedby={errors.orgName ? 'err-orgName' : undefined}
                        />
                        {errors.orgName && (
                          <div id="err-orgName" className="contact-error" role="alert">
                            {errors.orgName}
                          </div>
                        )}
                      </div>

                      {/* Contact person */}
                      <div className="contact-field">
                        <span className="contact-label d-block">
                          Contact Person <span className="text-danger" aria-hidden="true">*</span>
                        </span>
                        <div className="row g-2">
                          <div className="col-12 col-sm-4">
                            <label htmlFor="contact-firstName" className="visually-hidden">
                              First Name
                            </label>
                            <input
                              id="contact-firstName"
                              type="text"
                              className={inputCls('firstName')}
                              placeholder="First name"
                              value={form.firstName}
                              onChange={set('firstName')}
                              required
                              aria-required="true"
                              aria-invalid={!!errors.firstName}
                              aria-describedby={errors.firstName ? 'err-firstName' : undefined}
                            />
                            {errors.firstName && (
                              <div id="err-firstName" className="contact-error" role="alert">
                                {errors.firstName}
                              </div>
                            )}
                          </div>
                          <div className="col-12 col-sm-4">
                            <label htmlFor="contact-middleName" className="visually-hidden">
                              Middle Name (optional)
                            </label>
                            <input
                              id="contact-middleName"
                              type="text"
                              className="contact-input"
                              placeholder="Middle name (optional)"
                              value={form.middleName}
                              onChange={set('middleName')}
                            />
                          </div>
                          <div className="col-12 col-sm-4">
                            <label htmlFor="contact-lastName" className="visually-hidden">
                              Last Name
                            </label>
                            <input
                              id="contact-lastName"
                              type="text"
                              className={inputCls('lastName')}
                              placeholder="Last name"
                              value={form.lastName}
                              onChange={set('lastName')}
                              required
                              aria-required="true"
                              aria-invalid={!!errors.lastName}
                              aria-describedby={errors.lastName ? 'err-lastName' : undefined}
                            />
                            {errors.lastName && (
                              <div id="err-lastName" className="contact-error" role="alert">
                                {errors.lastName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="contact-field">
                        <label htmlFor="contact-phone" className="contact-label">
                          Phone Number <span className="text-danger" aria-hidden="true">*</span>
                        </label>
                        <div className="contact-phone-row">
                          <label htmlFor="contact-country-code" className="visually-hidden">
                            Country Calling Code
                          </label>
                          <select
                            id="contact-country-code"
                            className="contact-country-select"
                            value={form.countryCode}
                            onChange={set('countryCode')}
                            aria-label="Country calling code"
                          >
                            {countryCodes.map((c) => (
                              <option key={`${c.code}-${c.name}`} value={c.code}>
                                {c.flag} {c.name} {c.code}
                              </option>
                            ))}
                          </select>
                          <input
                            id="contact-phone"
                            type="tel"
                            className={inputCls('phone') + ' contact-phone-input'}
                            placeholder="7911 123456"
                            value={form.phone}
                            onChange={set('phone')}
                            required
                            aria-required="true"
                            aria-invalid={!!errors.phone}
                            aria-describedby={errors.phone ? 'err-phone' : undefined}
                          />
                        </div>
                        {errors.phone && (
                          <div id="err-phone" className="contact-error" role="alert">
                            {errors.phone}
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="contact-field">
                        <label htmlFor="contact-email" className="contact-label">
                          Email Address <span className="text-danger" aria-hidden="true">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          className={inputCls('email')}
                          placeholder="you@company.com"
                          value={form.email}
                          onChange={set('email')}
                          required
                          aria-required="true"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? 'err-email' : undefined}
                        />
                        {errors.email && (
                          <div id="err-email" className="contact-error" role="alert">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      {/* Note */}
                      <div className="contact-field">
                        <label htmlFor="contact-note" className="contact-label">
                          Note{' '}
                          <span className="contact-label-optional">(optional)</span>
                        </label>
                        <textarea
                          id="contact-note"
                          className="contact-input"
                          rows={4}
                          placeholder="Tell us about your team size, current recognition approach, or anything you'd like us to know before the demo…"
                          value={form.note}
                          onChange={set('note')}
                          style={{ resize: 'vertical' }}
                        />
                      </div>

                      <div className="contact-form-footer">
                        <p className="contact-consent">
                          By submitting you agree to our{' '}
                          <span
                            role="button"
                            tabIndex={0}
                            style={{ color: 'var(--navy)', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => setModal('privacy')}
                            onKeyDown={(e) => { if (e.key === 'Enter') setModal('privacy'); }}
                          >
                            Privacy Policy
                          </span>.
                          We never share your data with third parties.
                        </p>
                        <div className="contact-submit-row">
                          <Link href="/" className="btn btn-ghost-outline">
                            Cancel
                          </Link>
                          <button type="submit" className="btn btn-primary-cta">
                            <i className="bi bi-send me-2" />
                            Send Request
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Sidebar info */}
                <div className="col-12 col-lg-4">
                  <div className="contact-info-block">
                    <div className="contact-info-heading">What Happens Next</div>
                    {[
                      { icon: 'bi-envelope-check', step: '1', title: 'We review your request', body: "Our enterprise team reviews your organisation's details and tailors the demo to your sector." },
                      { icon: 'bi-calendar2-check', step: '2', title: 'Schedule confirmed', body: "You'll receive a calendar invite within one business day with a 45-minute slot." },
                      { icon: 'bi-laptop', step: '3', title: 'Live walkthrough', body: 'A dedicated specialist walks you through the full platform with your use case in mind.' },
                    ].map((item) => (
                      <div className="contact-step" key={item.step}>
                        <div className="contact-step__icon">
                          <i className={`bi ${item.icon}`} />
                        </div>
                        <div>
                          <div className="contact-step__title">{item.title}</div>
                          <div className="contact-step__body">{item.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="contact-info-block" style={{ marginTop: 16 }}>
                    <div className="contact-info-heading">Direct Contact</div>
                    {[
                      { icon: 'bi-envelope', label: 'Enterprise Sales', value: 'enterprise@browniepoints.io' },
                      { icon: 'bi-telephone', label: 'UK Office', value: '+44 20 7946 0914' },
                      { icon: 'bi-geo-alt', label: 'Address', value: '22 Finsbury Square, London EC2A 1DX' },
                    ].map((row) => (
                      <div className="contact-detail-row" key={row.label}>
                        <i className={`bi ${row.icon}`} style={{ color: 'var(--amber)', flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--muted)', marginBottom: 2 }}>
                            {row.label}
                          </div>
                          <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{row.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer
        onOpenTerms={() => setModal('terms')}
        onOpenPrivacy={() => setModal('privacy')}
      />
      {modal && <LegalModal type={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
