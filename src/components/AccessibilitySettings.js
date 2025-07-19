import React, { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { Settings, X, RotateCcw, Type, Clock, Eye, Palette, Shield, Undo, Check } from 'lucide-react';
import './AccessibilitySettings.css';

const AccessibilitySettings = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const [activeTab, setActiveTab] = useState('general');

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'timing', label: 'Timing', icon: Clock },
    { id: 'safety', label: 'Safety', icon: Shield }
  ];

  const themes = [
    { id: 'default', name: 'Default', description: 'Original design', color: '#667eea' },
    { id: 'high-contrast', name: 'High Contrast', description: 'Maximum contrast for visibility', color: '#000000' },
    { id: 'dark', name: 'Dark Mode', description: 'Dark background for eye comfort', color: '#1e293b' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Small', size: '14px', preview: 'Aa' },
    { id: 'medium', name: 'Medium', size: '16px', preview: 'Aa' },
    { id: 'large', name: 'Large', size: '18px', preview: 'Aa' },
    { id: 'xlarge', name: 'Extra Large', size: '20px', preview: 'Aa' }
  ];

  const breathingTimeouts = [
    { id: 3000, name: 'Fast (3s)', description: 'Quick breathing cycles' },
    { id: 4000, name: 'Normal (4s)', description: 'Standard breathing pace' },
    { id: 6000, name: 'Slow (6s)', description: 'Relaxed breathing pace' },
    { id: 8000, name: 'Very Slow (8s)', description: 'Extended breathing cycles' }
  ];

  const renderGeneralTab = () => (
    <div className="settings-section">
      <h3>General Accessibility</h3>
      
      <div className="setting-group">
        <div className="setting-header">
          <label className="setting-label">
            <RotateCcw size={20} />
            <span>Simplified Mode</span>
          </label>
          <div className="setting-control">
            <input
              type="checkbox"
              id="simplifiedMode"
              checked={settings.simplifiedMode}
              onChange={(e) => updateSetting('simplifiedMode', e.target.checked)}
              aria-describedby="simplifiedMode-desc"
            />
            <label htmlFor="simplifiedMode" className="toggle-label">
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <p id="simplifiedMode-desc" className="setting-description">
          Reduces visual clutter and simplifies the interface for easier navigation
        </p>
      </div>

      <div className="setting-group">
        <div className="setting-header">
          <label className="setting-label">
            <Undo size={20} />
            <span>Show Undo Options</span>
          </label>
          <div className="setting-control">
            <input
              type="checkbox"
              id="showUndo"
              checked={settings.showUndo}
              onChange={(e) => updateSetting('showUndo', e.target.checked)}
              aria-describedby="showUndo-desc"
            />
            <label htmlFor="showUndo" className="toggle-label">
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <p id="showUndo-desc" className="setting-description">
          Display undo buttons for actions like deleting thoughts
        </p>
      </div>

      <div className="setting-group">
        <div className="setting-header">
          <label className="setting-label">
            <Shield size={20} />
            <span>Confirm Actions</span>
          </label>
          <div className="setting-control">
            <input
              type="checkbox"
              id="confirmActions"
              checked={settings.confirmActions}
              onChange={(e) => updateSetting('confirmActions', e.target.checked)}
              aria-describedby="confirmActions-desc"
            />
            <label htmlFor="confirmActions" className="toggle-label">
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        <p id="confirmActions-desc" className="setting-description">
          Show confirmation dialogs before important actions
        </p>
      </div>
    </div>
  );

  const renderVisualTab = () => (
    <div className="settings-section">
      <h3>Visual Settings</h3>
      
      <div className="setting-group">
        <label className="setting-label">
          <Type size={20} />
          <span>Font Size</span>
        </label>
        <div className="font-size-options">
          {fontSizes.map(size => (
            <button
              key={size.id}
              className={`font-size-option ${settings.fontSize === size.id ? 'active' : ''}`}
              onClick={() => updateSetting('fontSize', size.id)}
              aria-label={`Set font size to ${size.name}`}
            >
              <span 
                className="font-preview"
                style={{ fontSize: size.size }}
              >
                {size.preview}
              </span>
              <span className="font-size-name">{size.name}</span>
            </button>
          ))}
        </div>
        <p className="setting-description">
          Adjust text size for better readability
        </p>
      </div>

      <div className="setting-group">
        <label className="setting-label">
          <Palette size={20} />
          <span>Theme</span>
        </label>
        <div className="theme-options">
          {themes.map(theme => (
            <button
              key={theme.id}
              className={`theme-option ${settings.theme === theme.id ? 'active' : ''}`}
              onClick={() => updateSetting('theme', theme.id)}
              aria-label={`Switch to ${theme.name} theme`}
            >
              <div 
                className="theme-preview-box"
                style={{ backgroundColor: theme.color }}
              ></div>
              <div className="theme-info">
                <span className="theme-name">{theme.name}</span>
                <small className="theme-description">{theme.description}</small>
              </div>
              {settings.theme === theme.id && (
                <Check size={16} className="theme-check" />
              )}
            </button>
          ))}
        </div>
        <p className="setting-description">
          Choose a color scheme that works best for your vision
        </p>
      </div>
    </div>
  );

  const renderTimingTab = () => (
    <div className="settings-section">
      <h3>Timing Settings</h3>
      
      <div className="setting-group">
        <label className="setting-label">
          <Clock size={20} />
          <span>Breathing Cycle Duration</span>
        </label>
        <div className="breathing-options">
          {breathingTimeouts.map(timeout => (
            <button
              key={timeout.id}
              className={`breathing-option ${settings.breathingTimeout === timeout.id ? 'active' : ''}`}
              onClick={() => updateSetting('breathingTimeout', timeout.id)}
              aria-label={`Set breathing duration to ${timeout.name}`}
            >
              <div className="breathing-info">
                <span className="breathing-name">{timeout.name}</span>
                <small className="breathing-description">{timeout.description}</small>
              </div>
              {settings.breathingTimeout === timeout.id && (
                <Check size={16} className="breathing-check" />
              )}
            </button>
          ))}
        </div>
        <p className="setting-description">
          Adjust how long each breathing cycle takes. Longer cycles are better for relaxation.
        </p>
      </div>

      <div className="breathing-preview">
        <h4>Current Setting: {breathingTimeouts.find(t => t.id === settings.breathingTimeout)?.name}</h4>
        <div className="breathing-stats">
          <div className="stat">
            <span className="stat-label">Cycle Duration</span>
            <span className="stat-value">{(settings.breathingTimeout / 1000).toFixed(1)}s</span>
          </div>
          <div className="stat">
            <span className="stat-label">10-Breath Session</span>
            <span className="stat-value">{((settings.breathingTimeout * 10) / 1000 / 60).toFixed(1)} min</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSafetyTab = () => (
    <div className="settings-section">
      <h3>Safety & Recovery</h3>
      
      <div className="setting-group">
        <div className="reset-section">
          <div className="reset-info">
            <h4>Reset All Settings</h4>
            <p>Restore all accessibility settings to their default values</p>
          </div>
          <button 
            className="reset-button"
            onClick={() => {
              if (settings.confirmActions) {
                if (window.confirm('Are you sure you want to reset all accessibility settings to default?')) {
                  resetSettings();
                }
              } else {
                resetSettings();
              }
            }}
            aria-describedby="reset-desc"
          >
            <RotateCcw size={16} />
            Reset Settings
          </button>
        </div>
      </div>

      <div className="safety-info">
        <h4>Accessibility Features</h4>
        <ul>
          <li>All settings are automatically saved</li>
          <li>Settings persist between sessions</li>
          <li>Changes apply immediately</li>
          <li>You can always reset to defaults</li>
        </ul>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'visual':
        return renderVisualTab();
      case 'timing':
        return renderTimingTab();
      case 'safety':
        return renderSafetyTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="accessibility-modal-overlay" onClick={onClose}>
      <div className="accessibility-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Accessibility Settings</h2>
          <button onClick={onClose} className="close-btn" aria-label="Close settings">
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                aria-label={`Switch to ${tab.label} settings`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="modal-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings; 