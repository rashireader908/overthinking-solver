import React, { useState } from 'react';
import { 
  Brain, 
  Heart, 
  Lightbulb, 
  Target, 
  ChevronDown, 
  ChevronUp,
  Clock,
  BookOpen,
  Sparkles,
  Eye,
  MessageCircle
} from 'lucide-react';
import { getThoughtPatternInsights, getMindfulnessTechniques } from '../services/geminiService';
import './AIResponse.css';

const AIResponse = ({ response, thought }) => {
  const [expandedSections, setExpandedSections] = useState({
    pattern: false,
    techniques: false,
    reframing: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const thoughtPatternInsight = getThoughtPatternInsights(response.thoughtPattern);
  const allTechniques = getMindfulnessTechniques();
  const suggestedTechniques = response.techniques || [];

  return (
    <div className="ai-response-enhanced">
      {/* Header */}
      <div className="ai-response-header">
        <div className="ai-response-title">
          <Sparkles size={16} />
          <span>AI Mindfulness Analysis</span>
        </div>
        <div className="ai-response-meta">
          <span className="response-type">Comprehensive Analysis</span>
        </div>
      </div>

      {/* Main Guidance */}
      <div className="ai-guidance-main">
        <div className="guidance-icon">
          <Heart size={20} />
        </div>
        <div className="guidance-content">
          <h4>Mindful Guidance</h4>
          <p>{response.guidance || response.message}</p>
        </div>
      </div>

      {/* Thought Pattern Analysis */}
      <div className="ai-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('pattern')}
        >
          <div className="section-title">
            <Brain size={16} />
            <span>Thought Pattern</span>
          </div>
          <div className="section-meta">
            <span className="pattern-badge">{thoughtPatternInsight.name}</span>
            {expandedSections.pattern ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        
        {expandedSections.pattern && (
          <div className="section-content">
            <div className="pattern-description">
              <p><strong>Description:</strong> {thoughtPatternInsight.description}</p>
              <p><strong>Example:</strong> "{thoughtPatternInsight.example}"</p>
              <p><strong>Technique:</strong> {thoughtPatternInsight.technique}</p>
            </div>
            {response.analysis && (
              <div className="pattern-analysis">
                <h5>Analysis of Your Thought</h5>
                <p>{response.analysis}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emotional Validation */}
      {response.validation && (
        <div className="ai-section">
          <div className="section-header">
            <div className="section-title">
              <Heart size={16} />
              <span>Emotional Support</span>
            </div>
          </div>
          <div className="section-content">
            <div className="validation-content">
              <p>{response.validation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cognitive Reframing */}
      {response.reframing && (
        <div className="ai-section">
          <button 
            className="section-header"
            onClick={() => toggleSection('reframing')}
          >
            <div className="section-title">
              <Lightbulb size={16} />
              <span>Reframing</span>
            </div>
            {expandedSections.reframing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.reframing && (
            <div className="section-content">
              <div className="reframing-content">
                <div className="original-thought">
                  <h5>Original Thought</h5>
                  <p>"{thought}"</p>
                </div>
                <div className="reframed-thought">
                  <h5>Reframed Perspective</h5>
                  <p>{response.reframing}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mindfulness Techniques */}
      <div className="ai-section">
        <button 
          className="section-header"
          onClick={() => toggleSection('techniques')}
        >
          <div className="section-title">
            <Target size={16} />
            <span>Mindfulness Techniques</span>
          </div>
          <div className="section-meta">
            <span className="technique-count">{suggestedTechniques.length} suggested</span>
            {expandedSections.techniques ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>
        
        {expandedSections.techniques && (
          <div className="section-content">
            <div className="techniques-grid">
              {suggestedTechniques.map((techniqueName, index) => {
                const technique = allTechniques.find(t => t.name === techniqueName) || {
                  name: techniqueName,
                  description: "A mindfulness technique to help you stay present",
                  steps: ["Take a moment to breathe", "Focus on the present", "Practice with patience"]
                };
                
                return (
                  <div key={index} className="technique-card">
                    <div className="technique-header">
                      <h5>{technique.name}</h5>
                      <span className="technique-number">#{index + 1}</span>
                    </div>
                    <p className="technique-description">{technique.description}</p>
                    <div className="technique-steps">
                      <h6>Steps:</h6>
                      <ol>
                        {technique.steps.map((step, stepIndex) => (
                          <li key={stepIndex}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="all-techniques-link">
              <button className="view-all-techniques-btn">
                <BookOpen size={14} />
                View All Mindfulness Techniques
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="ai-quick-actions">
        <button className="quick-action-btn">
          <Eye size={14} />
          <span>Save Analysis</span>
        </button>
        <button className="quick-action-btn">
          <MessageCircle size={14} />
          <span>Ask Follow-up</span>
        </button>
        <button className="quick-action-btn">
          <Clock size={14} />
          <span>Set Reminder</span>
        </button>
      </div>
    </div>
  );
};

export default AIResponse; 