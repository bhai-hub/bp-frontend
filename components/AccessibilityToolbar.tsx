'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility, TextSizeType } from '../context/AccessibilityContext';

export const AccessibilityToolbar: React.FC = () => {
  const {
    highContrast,
    setHighContrast,
    textSize,
    setTextSize,
    readableFont,
    setReadableFont,
    reducedMotion,
    setReducedMotion,
    underlineLinks,
    setUnderlineLinks,
    focusHighlight,
    setFocusHighlight,
    isToolbarOpen,
    setIsToolbarOpen,
    resetDefaults,
    announce,
  } = useAccessibility();

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & trap focus
  useEffect(() => {
    if (!isToolbarOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsToolbarOpen(false);
        triggerRef.current?.focus();
        announce('Accessibility preferences dialog closed');
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Focus the first element inside the modal
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isToolbarOpen, setIsToolbarOpen, announce]);

  return (
    <>
      {/* Floating Accessibility Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        className="a11y-trigger-btn"
        onClick={() => {
          setIsToolbarOpen((prev) => !prev);
          if (!isToolbarOpen) {
            announce('Accessibility preferences dialog opened');
          }
        }}
        aria-label="Accessibility options and settings. Press Enter or Space to open."
        aria-haspopup="dialog"
        aria-expanded={isToolbarOpen}
        title="Accessibility Settings (WCAG AA)"
      >
        <i className="bi bi-universal-access" aria-hidden="true" />
        <span className="a11y-trigger-text">Accessibility</span>
      </button>

      {/* Accessible Modal Dialog */}
      {isToolbarOpen && (
        <div
          className="a11y-backdrop"
          onClick={() => {
            setIsToolbarOpen(false);
            triggerRef.current?.focus();
          }}
          role="presentation"
        >
          <div
            ref={modalRef}
            className="a11y-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-dialog-title"
            aria-describedby="a11y-dialog-desc"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="a11y-header">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-universal-access-circle fs-4 text-warning" aria-hidden="true" />
                <h2 id="a11y-dialog-title" className="m-0 fs-5 fw-bold">
                  Accessibility Preferences (WCAG AA)
                </h2>
              </div>
              <button
                ref={firstFocusableRef}
                type="button"
                className="btn-close-a11y"
                onClick={() => {
                  setIsToolbarOpen(false);
                  triggerRef.current?.focus();
                  announce('Accessibility preferences dialog closed');
                }}
                aria-label="Close accessibility preferences dialog"
              >
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </div>

            <p id="a11y-dialog-desc" className="a11y-intro-text">
              Adjust visual presentation, font sizing, contrast, and navigation preferences according to your needs. These settings are saved automatically on this device.
            </p>

            <div className="a11y-body">
              {/* Option 1: High Contrast */}
              <div className="a11y-row">
                <div className="a11y-row-info">
                  <span className="a11y-label">
                    <i className="bi bi-circle-half me-2" aria-hidden="true" />
                    High Contrast Mode
                  </span>
                  <span className="a11y-sublabel">
                    Enforces maximum 7:1+ contrast with solid backgrounds and crisp borders.
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn-a11y-toggle ${highContrast ? 'active' : ''}`}
                  onClick={() => {
                    setHighContrast((v) => !v);
                    announce(`High contrast mode ${!highContrast ? 'enabled' : 'disabled'}`);
                  }}
                  role="switch"
                  aria-checked={highContrast}
                  aria-label="Toggle High Contrast Mode"
                >
                  <span className="toggle-slider" aria-hidden="true" />
                  <span className="visually-hidden">{highContrast ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Option 2: Font Size Scaling */}
              <div className="a11y-row flex-column align-items-start gap-2">
                <div className="a11y-row-info">
                  <span className="a11y-label">
                    <i className="bi bi-fonts me-2" aria-hidden="true" />
                    Text Sizing (WCAG 1.4.4)
                  </span>
                  <span className="a11y-sublabel">
                    Scale interface text up to 140% for enhanced legibility.
                  </span>
                </div>
                <div className="btn-group w-100" role="group" aria-label="Text size options">
                  {(['normal', 'large', 'xlarge'] as TextSizeType[]).map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`btn btn-outline-secondary btn-sm a11y-size-btn ${textSize === size ? 'active fw-bold' : ''}`}
                      onClick={() => {
                        setTextSize(size);
                        const label = size === 'normal' ? '100% standard' : size === 'large' ? '120% large' : '140% extra large';
                        announce(`Text size changed to ${label}`);
                      }}
                      aria-pressed={textSize === size}
                    >
                      {size === 'normal' ? 'Standard (100%)' : size === 'large' ? 'Large (+20%)' : 'Extra Large (+40%)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 3: Dyslexia / Legibility Font */}
              <div className="a11y-row">
                <div className="a11y-row-info">
                  <span className="a11y-label">
                    <i className="bi bi-type me-2" aria-hidden="true" />
                    High Legibility Font
                  </span>
                  <span className="a11y-sublabel">
                    Increases letter spacing, word spacing, and applies simplified character shapes.
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn-a11y-toggle ${readableFont ? 'active' : ''}`}
                  onClick={() => {
                    setReadableFont((v) => !v);
                    announce(`High legibility font ${!readableFont ? 'enabled' : 'disabled'}`);
                  }}
                  role="switch"
                  aria-checked={readableFont}
                  aria-label="Toggle High Legibility Font"
                >
                  <span className="toggle-slider" aria-hidden="true" />
                  <span className="visually-hidden">{readableFont ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Option 4: Underline Links */}
              <div className="a11y-row">
                <div className="a11y-row-info">
                  <span className="a11y-label">
                    <i className="bi bi-link-45deg me-2" aria-hidden="true" />
                    Underline All Links (WCAG 1.4.1)
                  </span>
                  <span className="a11y-sublabel">
                    Ensures links are distinguishable without relying on color alone.
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn-a11y-toggle ${underlineLinks ? 'active' : ''}`}
                  onClick={() => {
                    setUnderlineLinks((v) => !v);
                    announce(`Underline links ${!underlineLinks ? 'enabled' : 'disabled'}`);
                  }}
                  role="switch"
                  aria-checked={underlineLinks}
                  aria-label="Toggle Underline All Links"
                >
                  <span className="toggle-slider" aria-hidden="true" />
                  <span className="visually-hidden">{underlineLinks ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Option 5: Reduced Motion */}
              <div className="a11y-row">
                <div className="a11y-row-info">
                  <span className="a11y-label">
                    <i className="bi bi-pause-circle me-2" aria-hidden="true" />
                    Stop Animations & Reduced Motion (WCAG 2.2.2)
                  </span>
                  <span className="a11y-sublabel">
                    Disables all CSS transitions, animations, and smooth scrolling for vestibular safety.
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn-a11y-toggle ${reducedMotion ? 'active' : ''}`}
                  onClick={() => {
                    setReducedMotion((v) => !v);
                    announce(`Reduced motion ${!reducedMotion ? 'enabled' : 'disabled'}`);
                  }}
                  role="switch"
                  aria-checked={reducedMotion}
                  aria-label="Toggle Stop Animations and Reduced Motion"
                >
                  <span className="toggle-slider" aria-hidden="true" />
                  <span className="visually-hidden">{reducedMotion ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Option 6: Focus Ring Highlight */}
              <div className="a11y-row">
                <div className="a11y-row-info">
                  <span className="a11y-label">
                    <i className="bi bi-cursor-fill me-2" aria-hidden="true" />
                    Enhanced Focus Ring (WCAG 2.4.7)
                  </span>
                  <span className="a11y-sublabel">
                    Displays high-visibility 3px amber focus rings on active keyboard elements.
                  </span>
                </div>
                <button
                  type="button"
                  className={`btn-a11y-toggle ${focusHighlight ? 'active' : ''}`}
                  onClick={() => {
                    setFocusHighlight((v) => !v);
                    announce(`Enhanced focus ring ${!focusHighlight ? 'enabled' : 'disabled'}`);
                  }}
                  role="switch"
                  aria-checked={focusHighlight}
                  aria-label="Toggle Enhanced Focus Ring"
                >
                  <span className="toggle-slider" aria-hidden="true" />
                  <span className="visually-hidden">{focusHighlight ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* Keyboard Navigation Quick Reference */}
              <div className="a11y-keyboard-help mt-3 p-3 bg-light rounded border">
                <span className="fw-bold d-block mb-1">
                  <i className="bi bi-keyboard me-2" aria-hidden="true" />
                  Keyboard Navigation Shortcuts:
                </span>
                <ul className="mb-0 ps-3 small text-muted">
                  <li><kbd>Tab</kbd> / <kbd>Shift + Tab</kbd>: Move between interactive elements</li>
                  <li><kbd>Enter</kbd> / <kbd>Space</kbd>: Activate buttons and toggles</li>
                  <li><kbd>Esc</kbd>: Close open dialogs and menus</li>
                  <li><kbd>Alt + A</kbd> or click the floating button to open accessibility options</li>
                </ul>
              </div>
            </div>

            <div className="a11y-footer d-flex justify-content-between align-items-center">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={resetDefaults}
                aria-label="Reset all accessibility preferences to default"
              >
                <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
                Reset Defaults
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsToolbarOpen(false);
                  triggerRef.current?.focus();
                  announce('Preferences saved. Dialog closed.');
                }}
                aria-label="Save preferences and close dialog"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityToolbar;
