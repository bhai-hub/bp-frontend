'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type TextSizeType = 'normal' | 'large' | 'xlarge';

interface AccessibilitySettings {
  highContrast: boolean;
  textSize: TextSizeType;
  readableFont: boolean;
  reducedMotion: boolean;
  underlineLinks: boolean;
  focusHighlight: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  setHighContrast: (value: boolean | ((prev: boolean) => boolean)) => void;
  setTextSize: (value: TextSizeType | ((prev: TextSizeType) => TextSizeType)) => void;
  setReadableFont: (value: boolean | ((prev: boolean) => boolean)) => void;
  setReducedMotion: (value: boolean | ((prev: boolean) => boolean)) => void;
  setUnderlineLinks: (value: boolean | ((prev: boolean) => boolean)) => void;
  setFocusHighlight: (value: boolean | ((prev: boolean) => boolean)) => void;
  isToolbarOpen: boolean;
  setIsToolbarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  resetDefaults: () => void;
  announce: (message: string, politeness?: 'polite' | 'assertive') => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  textSize: 'normal',
  readableFont: false,
  reducedMotion: false,
  underlineLinks: false,
  focusHighlight: true, // Enabled by default for WCAG 2.4.7 Focus Visible
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'bp_accessibility_settings_v1';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(defaultSettings.highContrast);
  const [textSize, setTextSize] = useState<TextSizeType>(defaultSettings.textSize);
  const [readableFont, setReadableFont] = useState<boolean>(defaultSettings.readableFont);
  const [reducedMotion, setReducedMotion] = useState<boolean>(defaultSettings.reducedMotion);
  const [underlineLinks, setUnderlineLinks] = useState<boolean>(defaultSettings.underlineLinks);
  const [focusHighlight, setFocusHighlight] = useState<boolean>(defaultSettings.focusHighlight);
  const [isToolbarOpen, setIsToolbarOpen] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<{ text: string; politeness: 'polite' | 'assertive' }>({
    text: '',
    politeness: 'polite',
  });

  // Load saved preferences from localStorage & system prefers-reduced-motion
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.highContrast === 'boolean') setHighContrast(parsed.highContrast);
        if (['normal', 'large', 'xlarge'].includes(parsed.textSize)) setTextSize(parsed.textSize);
        if (typeof parsed.readableFont === 'boolean') setReadableFont(parsed.readableFont);
        if (typeof parsed.reducedMotion === 'boolean') setReducedMotion(parsed.reducedMotion);
        if (typeof parsed.underlineLinks === 'boolean') setUnderlineLinks(parsed.underlineLinks);
        if (typeof parsed.focusHighlight === 'boolean') setFocusHighlight(parsed.focusHighlight);
      } else {
        // Check system preference for reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setReducedMotion(true);
        }
        // Check system preference for contrast
        if (window.matchMedia('(prefers-contrast: more)').matches) {
          setHighContrast(true);
        }
      }
    } catch (e) {
      console.warn('Unable to access localStorage for accessibility preferences:', e);
    }
  }, []);

  // Sync state to <html> element dataset and localStorage
  useEffect(() => {
    const root = document.documentElement;

    root.dataset.contrast = highContrast ? 'high' : 'standard';
    root.dataset.textSize = textSize;
    root.dataset.font = readableFont ? 'readable' : 'standard';
    root.dataset.reducedMotion = reducedMotion ? 'true' : 'false';
    root.dataset.underlineLinks = underlineLinks ? 'true' : 'false';
    root.dataset.focusMode = focusHighlight ? 'enhanced' : 'standard';

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          highContrast,
          textSize,
          readableFont,
          reducedMotion,
          underlineLinks,
          focusHighlight,
        }),
      );
    } catch (e) {
      // Storage write error handling
    }
  }, [highContrast, textSize, readableFont, reducedMotion, underlineLinks, focusHighlight]);

  const resetDefaults = useCallback(() => {
    setHighContrast(defaultSettings.highContrast);
    setTextSize(defaultSettings.textSize);
    setReadableFont(defaultSettings.readableFont);
    setReducedMotion(defaultSettings.reducedMotion);
    setUnderlineLinks(defaultSettings.underlineLinks);
    setFocusHighlight(defaultSettings.focusHighlight);
    announce('Accessibility preferences have been reset to default values.');
  }, []);

  const announce = useCallback((message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ text: message, politeness });
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
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
      }}
    >
      {/* Screen Reader Live Region for Announcements (WCAG 4.1.3 Status Messages) */}
      <div
        id="sr-announcements"
        role="status"
        aria-live={announcement.politeness}
        aria-atomic="true"
        className="visually-hidden"
      >
        {announcement.text}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
