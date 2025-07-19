import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Brain, 
  Heart, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Target,
  Lightbulb,
  MessageCircle,
  X
} from 'lucide-react';
import { getThoughtPatternInsights, getMindfulnessTechniques } from '../services/geminiService';
import './AIChat.css';

const AIChat = ({ isOpen, onClose, thoughts, onGetAIFeedback, isLoadingAI, currentThought }) => {
  const [expandedResponses, setExpandedResponses] = useState({});
  const [showTechniques, setShowTechniques] = useState({});
  const chatEndRef = useRef(null);

  const thoughtsWithAI = thoughts.filter(thought => thought.aiResponse);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [thoughtsWithAI]);

  const toggleExpanded = (thoughtId) => {
    setExpandedResponses(prev => ({
      ...prev,
      [thoughtId]: !prev[thoughtId]
    }));
  };

  const toggleTechniques = (thoughtId) => {
    setShowTechniques(prev => ({
      ...prev,
      [thoughtId]: !prev[thoughtId]
    }));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return '';
    }
  };

  const getThoughtPatternInsight = (pattern) => {
    return getThoughtPatternInsights(pattern);
  };

  const renderAIResponse = (thought) => {
    const response = thought.aiResponse;
    const isExpanded = expandedResponses[thought.id];
    const showTech = showTechniques[thought.id];
    
    // Handle both old format (string) and new format (object)
    if (typeof response === 'string') {
      return (
        <div className="ai-message simple">
          <div className="ai-avatar">
            <Sparkles size={16} />
          </div>
          <div className="ai-content">
            <div className="ai-header">
              <span className="ai-name">Mindfulness AI</span>
              <span className="ai-time">{formatTime(thought.timestamp)}</span>
            </div>
            <p>{response}</p>
          </div>
        </div>
      );
    }

    // New comprehensive format
    return (
      <div className="ai-message comprehensive">
        <div className="ai-avatar">
          <Sparkles size={16} />
        </div>
        <div className="ai-content">
          <div className="ai-header">
            <span className="ai-name">Mindfulness AI</span>
            <span className="ai-time">{formatTime(thought.timestamp)}</span>
          </div>
          
          {/* Main Guidance */}
          <div className="ai-main-guidance">
            <p>{response.guidance || response.message}</p>
          </div>

          {/* Thought Pattern */}
          {response.thoughtPattern && (
            <div className="ai-pattern-section">
              <button 
                className="pattern-toggle"
                onClick={() => toggleExpanded(thought.id)}
              >
                <Brain size={14} />
                <span>Thought Pattern: {getThoughtPatternInsight(response.thoughtPattern).name}</span>
                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {isExpanded && (
                <div className="pattern-details">
                  <p><strong>Description:</strong> {getThoughtPatternInsight(response.thoughtPattern).description}</p>
                  <p><strong>Example:</strong> "{getThoughtPatternInsight(response.thoughtPattern).example}"</p>
                  <p><strong>Technique:</strong> {getThoughtPatternInsight(response.thoughtPattern).technique}</p>
                  {response.analysis && (
                    <div className="pattern-analysis">
                      <p><strong>Analysis:</strong> {response.analysis}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Emotional Validation */}
          {response.validation && (
            <div className="ai-validation">
              <div className="validation-icon">
                <Heart size={14} />
              </div>
              <p>{response.validation}</p>
            </div>
          )}

          {/* Cognitive Reframing */}
          {response.reframing && (
            <div className="ai-reframing">
              <div className="reframing-header">
                <Lightbulb size={14} />
                <span>Reframing</span>
              </div>
              <div className="reframing-content">
                <div className="original">
                  <strong>Original:</strong> "{thought.content}"
                </div>
                <div className="reframed">
                  <strong>Reframed:</strong> {response.reframing}
                </div>
              </div>
            </div>
          )}

          {/* Mindfulness Techniques */}
          {response.techniques && response.techniques.length > 0 && (
            <div className="ai-techniques">
              <button 
                className="techniques-toggle"
                onClick={() => toggleTechniques(thought.id)}
              >
                <Target size={14} />
                <span>Mindfulness Techniques ({response.techniques.length})</span>
                {showTech ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              
              {showTech && (
                <div className="techniques-list">
                  {response.techniques.map((techniqueName, index) => {
                    const allTechniques = getMindfulnessTechniques();
                    const technique = allTechniques.find(t => t.name === techniqueName) || {
                      name: techniqueName,
                      description: "A mindfulness technique to help you stay present",
                      steps: ["Take a moment to breathe", "Focus on the present", "Practice with patience"]
                    };
                    
                    return (
                      <div key={index} className="technique-item">
                        <h4>{technique.name}</h4>
                        <p>{technique.description}</p>
                        <ol>
                          {technique.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`ai-chat-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <div className="chat-title">
          <Sparkles size={20} />
          <h3>AI Mindfulness Chat</h3>
        </div>
        <button className="close-chat-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages">
        {thoughtsWithAI.length === 0 ? (
          <div className="empty-chat">
            <MessageCircle size={48} />
            <h4>No AI conversations yet</h4>
            <p>Log a thought and get AI guidance to start your mindfulness journey!</p>
          </div>
        ) : (
          thoughtsWithAI.map(thought => (
            <div key={thought.id} className="chat-conversation">
              {/* User Message */}
              <div className="user-message">
                <div className="user-avatar">
                  <Brain size={16} />
                </div>
                <div className="user-content">
                  <div className="user-header">
                    <span className="user-name">You</span>
                    <span className="user-time">{formatTime(thought.timestamp)}</span>
                  </div>
                  <p>"{thought.content}"</p>
                </div>
              </div>

              {/* AI Response */}
              {renderAIResponse(thought)}
            </div>
          ))
        )}

        {/* Loading indicator */}
        {isLoadingAI && (
          <div className="ai-message loading">
            <div className="ai-avatar">
              <Sparkles size={16} />
            </div>
            <div className="ai-content">
              <div className="ai-header">
                <span className="ai-name">Mindfulness AI</span>
              </div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="chat-footer">
        <div className="chat-stats">
          <span>{thoughtsWithAI.length} conversations</span>
        </div>
      </div>
    </div>
  );
};

export default AIChat; 