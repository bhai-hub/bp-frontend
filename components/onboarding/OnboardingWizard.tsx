import React from 'react';

interface OnboardingWizardProps {
  currentStep: number;
}

const steps = [
  { step: 1, label: 'Account Activation', icon: 'bi-shield-check' },
  { step: 2, label: 'Profile Details', icon: 'bi-person-badge' },
  { step: 3, label: 'Ikigai Reflections', icon: 'bi-compass' },
  { step: 4, label: 'Ready for Platform', icon: 'bi-check2-circle' },
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ currentStep }) => {
  return (
    <div className="enterprise-card mb-4">
      <div className="p-3 p-md-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
          {steps.map((s, idx) => {
            const isCompleted = s.step < currentStep;
            const isCurrent = s.step === currentStep;

            return (
              <React.Fragment key={s.step}>
                <div className="d-flex align-items-center gap-2">
                  <div
                    className={`d-flex align-items-center justify-content-center rounded ${
                      isCompleted
                        ? 'bg-success text-white'
                        : isCurrent
                        ? 'bg-primary text-white'
                        : 'bg-light text-muted border'
                    }`}
                    style={{ width: '32px', height: '32px', fontSize: '0.85rem', fontWeight: 'bold' }}
                  >
                    {isCompleted ? <i className="bi bi-check-lg"></i> : s.step}
                  </div>
                  <div>
                    <span
                      className={`d-block small fw-bold ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-dark' : 'text-muted'
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="small text-muted d-none d-lg-inline" style={{ fontSize: '0.75rem' }}>
                      {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                    </span>
                  </div>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className="flex-grow-1 d-none d-md-block mx-2"
                    style={{
                      height: '2px',
                      backgroundColor: isCompleted ? '#10b981' : '#e2e8f0',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
