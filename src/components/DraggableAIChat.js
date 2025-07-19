import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize2, Maximize2, Heart, Brain } from 'lucide-react';
import { getAIFeedback } from '../services/geminiService';
import './DraggableAIChat.css';

const DraggableAIChat = ({ isVisible, onClose, currentThought, onThoughtLogged }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          type: 'ai',
          content: "Hi there! I'm your mindfulness companion. I'm here to help you explore your thoughts, practice mindfulness, and find peace. What's on your mind? 💙",
          timestamp: new Date()
        }
      ]);
    }
  }, [isVisible]);

  // Show AI response when a thought is logged
  useEffect(() => {
    if (currentThought && onThoughtLogged) {
      handleThoughtAnalysis(currentThought);
    }
  }, [currentThought]);

  const handleThoughtAnalysis = async (thought) => {
    setIsLoading(true);
    try {
      const response = await getAIFeedback(thought.content, {
        analysisType: 'comprehensive',
        includeTechniques: true,
        includeReframing: true,
        includeValidation: true
      });

      if (response.success) {
        const aiMessage = {
          id: Date.now(),
          type: 'ai',
          content: response.guidance || response.message,
          analysis: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now(),
          type: 'ai',
          content: "Thanks for sharing your thought! I'm here to help you explore it further. What would you like to discuss about this?",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: "Thanks for sharing your thought with me! I'm here to listen and help you explore your thoughts. What would you like to talk about?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await getAIFeedback(inputMessage, {
        analysisType: 'comprehensive',
        includeTechniques: true,
        includeReframing: true,
        includeValidation: true
      });

      if (response.success) {
        const aiMessage = {
          id: Date.now(),
          type: 'ai',
          content: response.guidance || response.message,
          analysis: response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now(),
          type: 'ai',
          content: "I'm here to support you. Let's continue our conversation and work through this together.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('AI Error:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: "I'm here to listen and help. Sometimes the most important thing is knowing you're not alone in this.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Dragging functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-controls') || e.target.closest('.chat-input')) return;
    
    setIsDragging(true);
    const rect = chatRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within viewport bounds
    const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 400);
    const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 500);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <div
      ref={chatRef}
      className={`draggable-ai-chat ${isMinimized ? 'minimized' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        left: position.x,
        top: position.y
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header */}
      <div className="chat-header">
        <div className="chat-title">
          <Brain size={16} />
          <span>Mindful AI Companion</span>
        </div>
        <div className="chat-controls">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="control-btn"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button onClick={onClose} className="control-btn close-btn" title="Close">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Chat Body */}
      {!isMinimized && (
        <>
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.type === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                {message.analysis && (
                  <div className="message-analysis">
                    <div className="analysis-item">
                      <Heart size={12} />
                      <span>Emotional Support</span>
                    </div>
                    {message.analysis.techniques && message.analysis.techniques.length > 0 && (
                      <div className="analysis-item">
                        <Brain size={12} />
                        <span>{message.analysis.techniques.length} Technique(s) Suggested</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="message ai-message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="chat-input"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            >
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DraggableAIChat; 