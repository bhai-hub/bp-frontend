'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { OnboardingWizard } from '../../../components/onboarding/OnboardingWizard';
import api from '../../../lib/api';
import {
  IkigaiQuestionnaire,
  IkigaiQuestion,
  IkigaiDimension,
} from '../../../types';

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
    subtitle: 'Activities, projects, and domains that spark your passion and deep curiosity',
    icon: 'bi-heart-fill',
    badgeClass: 'bg-danger-subtle text-danger border-danger-subtle',
  },
  {
    key: 'GOOD_AT',
    title: 'What You Are Good At',
    subtitle: 'Unique technical abilities, problem-solving skills, and domain strengths',
    icon: 'bi-lightning-charge-fill',
    badgeClass: 'bg-primary-subtle text-primary border-primary-subtle',
  },
  {
    key: 'WORLD_NEEDS',
    title: 'What The World Needs',
    subtitle: 'High-impact team goals, customer pain points, and societal contributions',
    icon: 'bi-globe-americas',
    badgeClass: 'bg-success-subtle text-success border-success-subtle',
  },
  {
    key: 'PAID_FOR',
    title: 'What You Can Be Paid For',
    subtitle: 'Core vocational value, professional deliverables, and market outcomes',
    icon: 'bi-cash-coin',
    badgeClass: 'bg-warning-subtle text-warning border-warning-subtle',
  },
];

export default function OnboardingIkigaiPage() {
  const { user, isLoading: authLoading, refreshUser, logout } = useAuth();
  const router = useRouter();

  const [questionnaire, setQuestionnaire] = useState<IkigaiQuestionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    const fetchQuestionnaire = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get('/ikigai/questionnaire');
        if (res.data.success) {
          setQuestionnaire(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load Ikigai questionnaire.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionnaire();
  }, [user, authLoading, router]);

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!questionnaire) return;

    // Validate required questions
    for (const q of questionnaire.questions) {
      if (q.isRequired && (!answers[q.id] || !answers[q.id].trim())) {
        setError(`Please provide an answer for: "${q.questionText}"`);
        return;
      }
    }

    // Format payload
    const formattedResponses = questionnaire.questions
      .filter((q) => answers[q.id] && answers[q.id].trim())
      .map((q) => ({
        questionId: q.id,
        dimension: q.dimension,
        response: answers[q.id].trim(),
      }));

    try {
      setSubmitting(true);
      const res = await api.post('/ikigai/responses', {
        questionnaireId: questionnaire.id,
        responses: formattedResponses,
      });

      if (res.data.success) {
        await refreshUser();
        router.push('/onboarding/complete');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save Ikigai reflections. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8fafc' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small">Loading Ikigai reflections module...</p>
        </div>
      </div>
    );
  }

  // Group questions by dimension
  const questionsByDimension: Record<IkigaiDimension, IkigaiQuestion[]> = {
    LOVE: [],
    GOOD_AT: [],
    WORLD_NEEDS: [],
    PAID_FOR: [],
  };

  if (questionnaire?.questions) {
    questionnaire.questions.forEach((q) => {
      if (questionsByDimension[q.dimension]) {
        questionsByDimension[q.dimension].push(q);
      }
    });
  }

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 bg-primary text-white rounded">
              <i className="bi bi-award-fill fs-5"></i>
            </div>
            <div>
              <h5 className="fw-bold text-dark mb-0">Brownie Points</h5>
              <span className="text-muted small">Employee Onboarding</span>
            </div>
          </div>
          <button onClick={logout} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-box-arrow-right me-1"></i> Sign Out
          </button>
        </div>

        {/* Stepper */}
        <OnboardingWizard currentStep={3} />

        {/* Privacy & Purpose Banner */}
        <div className="enterprise-card mb-4">
          <div className="p-4">
            <div className="d-flex align-items-start gap-3">
              <div
                className="p-3 bg-primary-subtle text-primary rounded d-flex align-items-center justify-content-center"
                style={{ width: '48px', height: '48px' }}
              >
                <i className="bi bi-compass-fill fs-4"></i>
              </div>
              <div className="flex-grow-1">
                <h5 className="fw-bold text-dark mb-1">Discovering Your Professional Ikigai</h5>
                <p className="text-muted small mb-2">
                  Ikigai (生きがい) represents the intersection of what you love, what you excel at, what the organization and world need, and what you are rewarded for. Aligning these dimensions enables meaningful work and authentic recognition.
                </p>
                <div className="d-flex align-items-center gap-2 small text-muted">
                  <i className="bi bi-shield-lock-fill text-success"></i>
                  <span>
                    <strong>Enterprise Privacy Guarantee:</strong> Your reflections are private to your career journey. They are decoupled from performance ratings, ranking algorithms, or public social feeds.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {DIMENSIONS.map((dim) => {
            const dimQuestions = questionsByDimension[dim.key] || [];
            if (dimQuestions.length === 0) return null;

            return (
              <div key={dim.key} className="enterprise-card mb-4">
                <div className="enterprise-card-header d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <i className={`bi ${dim.icon} fs-6`}></i>
                    <span className="fw-bold">{dim.title}</span>
                  </div>
                  <span className={`badge border ${dim.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                    Dimension: {dim.key}
                  </span>
                </div>

                <div className="p-4">
                  <p className="text-muted small mb-4">{dim.subtitle}</p>

                  <div className="row g-4">
                    {dimQuestions.map((q, idx) => (
                      <div key={q.id} className="col-12">
                        <label className="form-label small fw-semibold text-dark mb-1">
                          {idx + 1}. {q.questionText}
                          {q.isRequired && <span className="text-danger ms-1">*</span>}
                        </label>

                        {q.questionType === 'LONG_TEXT' ? (
                          <textarea
                            className="form-control"
                            rows={3}
                            placeholder="Share your personal reflections here..."
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            required={q.isRequired}
                          />
                        ) : q.questionType === 'SINGLE_SELECT' && q.options && Array.isArray(q.options) ? (
                          <select
                            className="form-select"
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            required={q.isRequired}
                          >
                            <option value="">-- Select an option --</option>
                            {q.options.map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Your reflection..."
                            value={answers[q.id] || ''}
                            onChange={(e) => handleInputChange(q.id, e.target.value)}
                            required={q.isRequired}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="d-flex justify-content-between align-items-center p-4 enterprise-card mb-5">
            <div>
              <span className="small fw-bold text-dark d-block">Ready to finalize?</span>
              <span className="small text-muted">You can review or adjust your reflections anytime in your employee profile.</span>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Submitting Reflections...
                </>
              ) : (
                <>
                  Complete Onboarding <i className="bi bi-check-circle-fill ms-1"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
