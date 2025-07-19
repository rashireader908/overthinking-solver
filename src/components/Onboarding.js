import React, { useState } from 'react';
import { 
  Brain, 
  Wind, 
  MessageCircle, 
  BookOpen, 
  Activity, 
  Music, 
  Heart, 
  Check,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import './Onboarding.css';

const Onboarding = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to Your Mindfulness Journey",
      subtitle: "Let's explore how this app can help you find peace and clarity",
      icon: <Heart size={48} />,
      content: "This app is designed to help you practice mindfulness, manage your thoughts, and develop a healthier relationship with your mind.",
      color: "#6366f1"
    },
    {
      title: "Log Your Thoughts",
      subtitle: "Capture and reflect on your thoughts with AI guidance",
      icon: <Brain size={48} />,
      content: "Write down your thoughts and get personalized AI feedback to help you understand patterns, cognitive distortions, and develop healthier thinking habits.",
      color: "#8b5cf6"
    },
    {
      title: "Breathing Exercises",
      subtitle: "Multiple techniques for relaxation and focus",
      icon: <Wind size={48} />,
      content: "Practice various breathing techniques like box breathing, 4-7-8, and more to reduce stress, improve focus, and find calm in any moment.",
      color: "#06b6d4"
    },
    {
      title: "AI Chat Companion",
      subtitle: "Get personalized mindfulness guidance",
      icon: <MessageCircle size={48} />,
      content: "Chat with our AI companion to get instant feedback on your thoughts, learn mindfulness techniques, and receive personalized guidance for your journey.",
      color: "#10b981"
    },
    {
      title: "Mindfulness Library",
      subtitle: "Explore techniques and practices",
      icon: <BookOpen size={48} />,
      content: "Access a comprehensive library of mindfulness techniques, meditation practices, and tools to support your mental well-being journey.",
      color: "#f59e0b"
    },
    {
      title: "Track Your Progress",
      subtitle: "Monitor your mindfulness journey",
      icon: <Activity size={48} />,
      content: "View detailed analytics, track your mood, monitor breathing sessions, and celebrate your progress with achievement badges.",
      color: "#ef4444"
    },
    {
      title: "Relaxing Music",
      subtitle: "Classical music for mindfulness",
      icon: <Music size={48} />,
      content: "Listen to carefully curated classical music to enhance your mindfulness practice and create a peaceful environment.",
      color: "#ec4899"
    },
    {
      title: "You're All Set!",
      subtitle: "Ready to begin your mindfulness journey",
      icon: <Check size={48} />,
      content: "You now have all the tools you need to start your mindfulness practice. Remember, this is a journey, not a destination. Take it one step at a time.",
      color: "#22c55e"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <div className="onboarding-header">
          <button className="skip-btn" onClick={handleSkip}>
            <X size={20} />
            Skip
          </button>
        </div>

        <div className="onboarding-content">
          <div 
            className="step-icon"
            style={{ backgroundColor: currentStepData.color }}
          >
            {currentStepData.icon}
          </div>

          <h2 className="step-title">{currentStepData.title}</h2>
          <p className="step-subtitle">{currentStepData.subtitle}</p>
          <p className="step-content">{currentStepData.content}</p>

          <div className="step-indicators">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`step-dot ${index === currentStep ? 'active' : ''}`}
                style={{ backgroundColor: index === currentStep ? currentStepData.color : '#e5e7eb' }}
              />
            ))}
          </div>
        </div>

        <div className="onboarding-footer">
          <button 
            className="nav-btn prev-btn"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft size={20} />
            Previous
          </button>

          <button 
            className="nav-btn next-btn"
            onClick={handleNext}
            style={{ backgroundColor: currentStepData.color }}
          >
            {isLastStep ? (
              <>
                Get Started
                <Check size={20} />
              </>
            ) : (
              <>
                Next
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 