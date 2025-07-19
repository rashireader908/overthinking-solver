import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  // Load saved settings from localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('mindfulness_accessibility');
    return saved ? JSON.parse(saved) : {
      fontSize: 'medium', // small, medium, large, xlarge
      breathingTimeout: 4000, // milliseconds per breath cycle
      simplifiedMode: false,
      theme: 'dark', // default, high-contrast, dark
      confirmActions: true,
      showUndo: true
    };
  });

  // Apply settings to document when they change
  useEffect(() => {
    // Apply font size to html element for better accessibility
    document.documentElement.setAttribute('data-font-size', settings.fontSize);

    // Apply theme
    document.body.className = `theme-${settings.theme}`;
    if (settings.simplifiedMode) {
      document.body.classList.add('simplified-mode');
    } else {
      document.body.classList.remove('simplified-mode');
    }

    // Save to localStorage
    localStorage.setItem('mindfulness_accessibility', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'medium',
      breathingTimeout: 4000,
      simplifiedMode: false,
      theme: 'dark',
      confirmActions: true,
      showUndo: true
    };
    setSettings(defaultSettings);
  };

  const value = {
    settings,
    updateSetting,
    resetSettings
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 