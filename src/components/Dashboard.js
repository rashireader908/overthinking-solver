import React, { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { getAIFeedback } from '../services/geminiService';
import AccessibilitySettings from './AccessibilitySettings';
import Analytics from './Analytics';
import MusicPlayer from './MusicPlayer';
import MindfulnessLibrary from './MindfulnessLibrary';
import DraggableAIChat from './DraggableAIChat';
import Onboarding from './Onboarding';
import Toast from './Toast';
import { 
  Brain, 
  Wind, 
  MessageCircle, 
  Plus,
  X,
  Heart,
  Clock,
  Activity,
  Trash2,
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  Settings,
  Undo2,
  Music,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { settings } = useAccessibility();
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const [breathingTechnique, setBreathingTechnique] = useState('box'); // box, 4-7-8, triangle, alternate
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [breathingCountdown, setBreathingCountdown] = useState(4);
  const [isBreathingExercise, setIsBreathingExercise] = useState(false);
  const [breathingSession, setBreathingSession] = useState({
    totalBreaths: 0,
    sessionDuration: 0,
    isActive: false
  });
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [showThoughtModal, setShowThoughtModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAccessibilitySettings, setShowAccessibilitySettings] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [currentThought, setCurrentThought] = useState(null);
  const [deletedThoughts, setDeletedThoughts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [breathingSessions, setBreathingSessions] = useState([]);
  const [showAllThoughts, setShowAllThoughts] = useState(false);
  const [showMindfulnessLibrary, setShowMindfulnessLibrary] = useState(false);
  const [showDraggableAIChat, setShowDraggableAIChat] = useState(false);
  const [currentDifficultThought, setCurrentDifficultThought] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  useEffect(() => {
    const savedThoughts = localStorage.getItem('mindfulness_thoughts');
    if (savedThoughts) {
      setThoughts(JSON.parse(savedThoughts).map(t => ({
        ...t,
        timestamp: new Date(t.timestamp)
      })));
    }
    
    const savedBreathingSessions = localStorage.getItem('mindfulness_breathing_sessions');
    if (savedBreathingSessions) {
      const parsedSessions = JSON.parse(savedBreathingSessions);
      // Convert timestamp strings back to Date objects
      const sessionsWithDates = parsedSessions.map(session => ({
        ...session,
        created_at: session.created_at ? new Date(session.created_at) : new Date()
      }));
      setBreathingSessions(sessionsWithDates);
    }

    // Check if user is new and show onboarding
    const hasCompletedOnboarding = localStorage.getItem('mindfulness_onboarding_completed');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const saveThoughts = (newThoughts) => {
    setThoughts(newThoughts);
    localStorage.setItem('mindfulness_thoughts', JSON.stringify(newThoughts));
  };

  const saveBreathingSessions = (newSessions) => {
    setBreathingSessions(newSessions);
    localStorage.setItem('mindfulness_breathing_sessions', JSON.stringify(newSessions));
  };

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addThought = () => {
    if (newThought.trim()) {
      const thought = {
        id: Date.now().toString(),
        content: newThought,
        timestamp: new Date()
      };
      const updatedThoughts = [thought, ...thoughts];
      saveThoughts(updatedThoughts);
      setNewThought('');
      setShowThoughtModal(false);
      addToast('Thought logged successfully!', 'success');
      
      // Always show AI chat when a thought is logged
      setCurrentDifficultThought(thought);
      setShowDraggableAIChat(true);
      addToast('Your AI companion is here to chat about your thoughts! 💙', 'info');
    }
  };

  const isDifficultThought = (thoughtContent) => {
    const difficultKeywords = [
      'anxious', 'worried', 'stress', 'overwhelmed', 'sad', 'depressed', 'lonely',
      'afraid', 'scared', 'fear', 'panic', 'angry', 'frustrated', 'hopeless',
      'worthless', 'failure', 'hate', 'terrible', 'awful', 'horrible', 'never',
      'always', 'everyone', 'nobody', 'should', 'must', 'can\'t', 'impossible',
      'end', 'die', 'kill', 'hurt', 'pain', 'suffering', 'crying', 'tears'
    ];
    
    const lowerThought = thoughtContent.toLowerCase();
    const difficultWordCount = difficultKeywords.filter(word => 
      lowerThought.includes(word)
    ).length;
    
    // Show AI chat if 2 or more difficult words are found
    return difficultWordCount >= 2;
  };

  const removeThought = (thoughtId) => {
    if (settings.confirmActions) {
      if (!window.confirm('Are you sure you want to delete this thought?')) {
        return;
      }
    }
    
    const thoughtToDelete = thoughts.find(t => t.id === thoughtId);
    const updatedThoughts = thoughts.filter(t => t.id !== thoughtId);
    saveThoughts(updatedThoughts);
    
    if (settings.showUndo) {
      setDeletedThoughts(prev => [...prev, { ...thoughtToDelete, deletedAt: Date.now() }]);
    }
  };

  const undoDelete = (thoughtId) => {
    const thoughtToRestore = deletedThoughts.find(t => t.id === thoughtId);
    if (thoughtToRestore) {
      const { deletedAt, ...thought } = thoughtToRestore;
      const updatedThoughts = [thought, ...thoughts];
      saveThoughts(updatedThoughts);
      setDeletedThoughts(prev => prev.filter(t => t.id !== thoughtId));
    }
  };

  const getAIFeedbackHandler = async (thought) => {
    setIsLoadingAI(true);
    setCurrentThought(thought);
    
    try {
      const response = await getAIFeedback(thought.content, {
        analysisType: 'comprehensive',
        includeTechniques: true,
        includeReframing: true,
        includeValidation: true
      });
      
      if (response.success) {
        const updatedThoughts = thoughts.map(t => 
          t.id === thought.id 
            ? { ...t, aiResponse: response }
            : t
        );
        saveThoughts(updatedThoughts);
        addToast('AI guidance received!', 'success');
      } else {
        console.error('AI Feedback Error:', response.error);
        addToast(response.message, 'error');
      }
    } catch (error) {
      console.error('Error getting AI feedback:', error);
      addToast('Failed to get AI guidance. Please try again.', 'error');
    } finally {
      setIsLoadingAI(false);
    }
  };



  const handleTechniqueSelection = (technique) => {
    setSelectedTechnique(technique);
    addToast(`Selected: ${technique.name}`, 'success');
    // You can add logic here to start the technique or show instructions
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('mindfulness_onboarding_completed', 'true');
    addToast('Welcome to your mindfulness journey! 🌟', 'success');
  };



  // Helper function to safely format dates
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return isNaN(date.getTime()) ? '' : date.toLocaleDateString();
    } catch (error) {
      console.warn('Invalid date format:', timestamp);
      return '';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return isNaN(date.getTime()) ? '' : date.toLocaleTimeString();
    } catch (error) {
      console.warn('Invalid time format:', timestamp);
      return '';
    }
  };

  const mindfulnessTechniques = [
    {
      title: "5-4-3-2-1 Grounding",
      description: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      icon: <Target size={24} />,
      color: "#667eea",
      interactive: true,
      type: "grounding",
      duration: "2-5 minutes",
      difficulty: "Beginner"
    },
    {
      title: "Box Breathing",
      description: "Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat this cycle.",
      icon: <Wind size={24} />,
      color: "#48bb78",
      interactive: true,
      type: "breathing",
      duration: "5-10 minutes",
      difficulty: "Beginner"
    },
    {
      title: "Body Scan",
      description: "Focus your attention on each part of your body, from toes to head, noticing sensations.",
      icon: <Activity size={24} />,
      color: "#ed8936",
      interactive: true,
      type: "meditation",
      duration: "10-20 minutes",
      difficulty: "Intermediate"
    },
    {
      title: "Thought Observation",
      description: "Watch your thoughts like clouds passing by. Don't judge them, just observe.",
      icon: <Brain size={24} />,
      color: "#9f7aea",
      interactive: true,
      type: "meditation",
      duration: "5-15 minutes",
      difficulty: "Intermediate"
    },
    {
      title: "Loving-Kindness",
      description: "Send good wishes to yourself, loved ones, and even difficult people in your life.",
      icon: <Heart size={24} />,
      color: "#f56565",
      interactive: true,
      type: "meditation",
      duration: "10-15 minutes",
      difficulty: "Intermediate"
    },
    {
      title: "Mindful Walking",
      description: "Walk slowly and deliberately, feeling each step and the ground beneath you.",
      icon: <Zap size={24} />,
      color: "#38b2ac",
      interactive: true,
      type: "movement",
      duration: "10-30 minutes",
      difficulty: "Beginner"
    },
    {
      title: "Progressive Muscle Relaxation",
      description: "Tense and release each muscle group to reduce physical tension and stress.",
      icon: <Activity size={24} />,
      color: "#38a169",
      interactive: true,
      type: "relaxation",
      duration: "10-15 minutes",
      difficulty: "Beginner"
    },
    {
      title: "Mindful Eating",
      description: "Eat slowly, savoring each bite and noticing flavors, textures, and sensations.",
      icon: <Heart size={24} />,
      color: "#d69e2e",
      interactive: true,
      type: "mindfulness",
      duration: "Meal duration",
      difficulty: "Beginner"
    },
    {
      title: "Gratitude Practice",
      description: "Reflect on three things you're grateful for, big or small, from today.",
      icon: <Heart size={24} />,
      color: "#e53e3e",
      interactive: true,
      type: "reflection",
      duration: "5 minutes",
      difficulty: "Beginner"
    },
    {
      title: "Mindful Listening",
      description: "Listen to sounds around you without judgment, focusing on the present moment.",
      icon: <MessageCircle size={24} />,
      color: "#805ad5",
      interactive: true,
      type: "mindfulness",
      duration: "5-10 minutes",
      difficulty: "Beginner"
    }
  ];

  const journalingPrompts = [
    "What am I grateful for today?",
    "What's challenging me right now, and how can I approach it with kindness?",
    "What would I tell a friend who was feeling this way?",
    "What small step can I take today to care for myself?",
    "What am I learning about myself through this experience?",
    "How can I be more present in this moment?",
    "What brings me joy, and how can I invite more of it into my life?",
    "What am I holding onto that I can let go of?"
  ];

  const moodTracking = [
    { mood: "😊", label: "Happy", color: "#48bb78" },
    { mood: "😌", label: "Calm", color: "#38b2ac" },
    { mood: "😐", label: "Neutral", color: "#a0aec0" },
    { mood: "😔", label: "Sad", color: "#667eea" },
    { mood: "😰", label: "Anxious", color: "#ed8936" },
    { mood: "😤", label: "Frustrated", color: "#f56565" },
    { mood: "😴", label: "Tired", color: "#805ad5" },
    { mood: "🤗", label: "Grateful", color: "#38a169" },
    { mood: "😤", label: "Stressed", color: "#e53e3e" },
    { mood: "😌", label: "Peaceful", color: "#3182ce" }
  ];



  const mindfulnessScience = [
    {
      title: "Stress Reduction",
      description: "Mindfulness reduces cortisol levels and activates the parasympathetic nervous system",
      research: "Harvard Health, 2018"
    },
    {
      title: "Improved Focus",
      description: "Regular practice increases gray matter in areas associated with attention and learning",
      research: "Neuroscience & Biobehavioral Reviews, 2019"
    },
    {
      title: "Emotional Regulation",
      description: "Mindfulness strengthens the prefrontal cortex, improving emotional control",
      research: "Nature Reviews Neuroscience, 2020"
    },
    {
      title: "Better Sleep",
      description: "Mindfulness meditation improves sleep quality and reduces insomnia",
      research: "JAMA Internal Medicine, 2015"
    },
    {
      title: "Pain Management",
      description: "Mindfulness reduces pain perception and improves pain tolerance",
      research: "Journal of Neuroscience, 2016"
    }
  ];

  const dailyTips = [
    {
      title: "Start Small",
      content: "Begin with just 1-2 minutes of mindfulness daily. Consistency matters more than duration.",
      category: "beginner"
    },
    {
      title: "Use Reminders",
      content: "Set gentle reminders on your phone or use everyday activities as mindfulness cues.",
      category: "practice"
    },
    {
      title: "Be Patient",
      content: "Mindfulness is a skill that develops over time. Don't judge yourself for wandering thoughts.",
      category: "attitude"
    },
    {
      title: "Find Your Time",
      content: "Experiment with different times of day to find when mindfulness feels most natural.",
      category: "practice"
    },
    {
      title: "Use Technology Wisely",
      content: "Apps can help, but don't rely on them completely. Learn to practice anywhere.",
      category: "technology"
    },
    {
      title: "Connect with Nature",
      content: "Spend time outdoors. Nature provides natural mindfulness opportunities.",
      category: "environment"
    },
    {
      title: "Practice Self-Compassion",
      content: "Treat yourself with the same kindness you'd offer a good friend.",
      category: "attitude"
    },
    {
      title: "Mindful Communication",
      content: "Listen fully when others speak, without planning your response.",
      category: "relationships"
    }
  ];

  const [activeTechnique, setActiveTechnique] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [helpTab, setHelpTab] = useState('techniques'); // techniques, journaling, mood, resources, science, tips

  useEffect(() => {
    const savedMoodHistory = localStorage.getItem('mindfulness_mood_history');
    if (savedMoodHistory) {
      const parsedHistory = JSON.parse(savedMoodHistory);
      // Convert timestamp strings back to Date objects
      const historyWithDates = parsedHistory.map(entry => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setMoodHistory(historyWithDates);
    }
  }, []);

  const saveMoodHistory = (newHistory) => {
    setMoodHistory(newHistory);
    localStorage.setItem('mindfulness_mood_history', JSON.stringify(newHistory));
  };

  const startTechnique = (technique) => {
    setActiveTechnique(technique);
    if (technique.type === 'breathing') {
      startBreathingSession('box');
    }
  };

  const stopTechnique = () => {
    setActiveTechnique(null);
    stopBreathingSession();
  };

  const addMoodEntry = (mood) => {
    const newEntry = {
      id: Date.now(),
      mood: mood.mood,
      label: mood.label,
      timestamp: new Date()
    };
    const updatedHistory = [newEntry, ...moodHistory.slice(0, 6)]; // Keep last 7 entries
    saveMoodHistory(updatedHistory);
    setCurrentMood(mood);
  };

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * journalingPrompts.length);
    setSelectedPrompt(journalingPrompts[randomIndex]);
  };

  // Calculate breathing durations based on accessibility settings
  const baseDuration = Math.round(settings.breathingTimeout / 1000);
  const breathingTechniques = {
    box: {
      name: "Box Breathing",
      description: "Equal inhale, hold, exhale, hold - perfect for stress relief",
      pattern: [
        { phase: 'inhale', duration: baseDuration, instruction: 'Inhale slowly through your nose' },
        { phase: 'hold1', duration: baseDuration, instruction: 'Hold your breath' },
        { phase: 'exhale', duration: baseDuration, instruction: 'Exhale slowly through your mouth' },
        { phase: 'hold2', duration: baseDuration, instruction: 'Hold empty' }
      ],
      color: '#48bb78'
    },
    '4-7-8': {
      name: "4-7-8 Breathing",
      description: "Inhale 4, hold 7, exhale 8 - promotes relaxation and sleep",
      pattern: [
        { phase: 'inhale', duration: Math.round(baseDuration * 0.5), instruction: 'Inhale quietly through your nose' },
        { phase: 'hold', duration: Math.round(baseDuration * 0.875), instruction: 'Hold your breath' },
        { phase: 'exhale', duration: baseDuration, instruction: 'Exhale completely through your mouth' }
      ],
      color: '#667eea'
    },
    triangle: {
      name: "Triangle Breathing",
      description: "Inhale, hold, exhale - simple and effective",
      pattern: [
        { phase: 'inhale', duration: baseDuration, instruction: 'Inhale deeply' },
        { phase: 'hold', duration: baseDuration, instruction: 'Hold' },
        { phase: 'exhale', duration: baseDuration, instruction: 'Exhale completely' }
      ],
      color: '#ed8936'
    },
    alternate: {
      name: "Alternate Nostril",
      description: "Alternate breathing through each nostril - balances energy",
      pattern: [
        { phase: 'inhale', duration: baseDuration, instruction: 'Inhale through left nostril' },
        { phase: 'hold', duration: baseDuration, instruction: 'Hold' },
        { phase: 'exhale', duration: baseDuration, instruction: 'Exhale through right nostril' },
        { phase: 'inhale2', duration: baseDuration, instruction: 'Inhale through right nostril' },
        { phase: 'hold2', duration: baseDuration, instruction: 'Hold' },
        { phase: 'exhale2', duration: baseDuration, instruction: 'Exhale through left nostril' }
      ],
      color: '#9f7aea'
    }
  };

  const startBreathing = () => {
    setShowBreathingModal(true);
  };

  const startBreathingSession = (technique = 'box') => {
    setBreathingTechnique(technique);
    setIsBreathing(true);
    setIsBreathingExercise(true);
    setBreathCount(0);
    setBreathingSession({
      totalBreaths: 0,
      sessionDuration: 0,
      isActive: true,
      startTime: Date.now()
    });
    
    const pattern = breathingTechniques[technique].pattern;
    setBreathingPhase(pattern[0].phase);
    setBreathingCountdown(pattern[0].duration);
  };

  const stopBreathingSession = () => {
    setIsBreathing(false);
    setIsBreathingExercise(false);
    
    const sessionDuration = Date.now() - breathingSession.startTime;
    const newSession = {
      id: Date.now(),
      technique: breathingTechnique,
      duration: Math.round(sessionDuration / 1000), // Convert to seconds
      totalBreaths: breathingSession.totalBreaths,
      created_at: new Date(),
      isActive: false,
      sessionDuration: sessionDuration
    };
    
    const updatedSessions = [newSession, ...breathingSessions];
    saveBreathingSessions(updatedSessions);
    
    setBreathingSession(prev => ({
      ...prev,
      isActive: false,
      sessionDuration: sessionDuration
    }));
    setShowBreathingModal(false);
    
    addToast(`Breathing session completed! ${newSession.totalBreaths} breaths in ${Math.round(sessionDuration / 1000)}s`, 'success');
  };

  const getBreathingInstruction = () => {
    const pattern = breathingTechniques[breathingTechnique].pattern;
    const currentStep = pattern.find(step => step.phase === breathingPhase);
    return currentStep ? currentStep.instruction : '';
  };

  const getBreathingPhaseText = () => {
    const phaseMap = {
      inhale: 'Inhale',
      inhale2: 'Inhale',
      hold: 'Hold',
      hold1: 'Hold',
      hold2: 'Hold',
      exhale: 'Exhale',
      exhale2: 'Exhale'
    };
    return phaseMap[breathingPhase] || 'Breathe';
  };

  // Enhanced breathing effect
  useEffect(() => {
    if (isBreathingExercise && breathingSession.isActive) {
      const interval = setInterval(() => {
        setBreathingCountdown(prev => {
          if (prev <= 1) {
            const pattern = breathingTechniques[breathingTechnique].pattern;
            const currentIndex = pattern.findIndex(step => step.phase === breathingPhase);
            const nextIndex = (currentIndex + 1) % pattern.length;
            const nextStep = pattern[nextIndex];
            
            setBreathingPhase(nextStep.phase);
            
            // Count complete cycles
            if (nextStep.phase === pattern[0].phase) {
              setBreathCount(prev => prev + 1);
              setBreathingSession(prev => ({
                ...prev,
                totalBreaths: prev.totalBreaths + 1
              }));
            }
            
            return nextStep.duration;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isBreathingExercise, breathingPhase, breathingTechnique, breathingSession.isActive, settings.breathingTimeout]);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Mindful Journey</h1>
          <div className="header-buttons">
            <button 
              className="header-btn"
              onClick={() => setShowMusicPlayer(true)}
              title="Mindfulness Music"
            >
              <Music size={16} />
              Music
            </button>
                          <button 
                className="header-btn chat-btn"
                onClick={() => setShowDraggableAIChat(!showDraggableAIChat)}
                title="AI Chat"
              >
                <MessageCircle size={16} />
                AI Chat
              </button>
            <button 
              onClick={() => setShowAccessibilitySettings(true)} 
              className="accessibility-btn"
              aria-label="Open accessibility settings"
            >
              <Settings size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Quick Actions */}
        <div className="quick-actions">
          <button 
            className="action-card breathing-card"
            onClick={startBreathing}
            disabled={isBreathing}
          >
            <Wind size={32} />
            <h3>Breathing Exercises</h3>
            <p>Multiple techniques for relaxation and focus</p>
            {isBreathing && (
              <div className="breathing-status">
                <div className="breathing-indicator"></div>
                <span>{breathingTechniques[breathingTechnique]?.name}</span>
              </div>
            )}
          </button>

          <button 
            className="action-card thought-card"
            onClick={() => setShowThoughtModal(true)}
          >
            <Brain size={32} />
            <h3>Log Your Thoughts</h3>
            <p>Capture and reflect on your thoughts</p>
          </button>

          <button 
            className="action-card help-card"
            onClick={() => setShowHelpModal(true)}
          >
            <MessageCircle size={32} />
            <h3>How to Help</h3>
            <p>Learn mindfulness techniques</p>
          </button>

          <button 
            className="action-card library-card"
            onClick={() => setShowMindfulnessLibrary(true)}
          >
            <BookOpen size={32} />
            <h3>Mindfulness Library</h3>
            <p>Explore techniques & practices</p>
          </button>
        </div>



        {/* Analytics Section */}
        <div className="analytics-section">
          <div className="section-header">
            <h2>Your Progress</h2>
            <button 
              className="toggle-analytics-btn"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </button>
          </div>
          
          {showAnalytics && (
            <Analytics 
              thoughts={thoughts}
              moodHistory={moodHistory}
              breathingSessions={breathingSessions}
            />
          )}
        </div>

        {/* Recent Thoughts - Compact */}
        <div className="thoughts-section compact">
          <div className="section-header">
            <h2>Recent Thoughts</h2>
            {thoughts.length > 0 && (
              <button 
                className="expand-thoughts-btn"
                onClick={() => setShowAllThoughts(!showAllThoughts)}
              >
                {showAllThoughts ? 'Show Less' : `Show All (${thoughts.length})`}
              </button>
            )}
          </div>
          
          <div className="thoughts-list compact">
            {thoughts.length === 0 ? (
              <div className="empty-state compact">
                <Brain size={32} />
                <p>No thoughts logged yet. Start your mindfulness journey!</p>
              </div>
            ) : (
              <>
                {/* Show first 3 thoughts always */}
                {thoughts.slice(0, 3).map(thought => (
                  <div key={thought.id} className="thought-item compact">
                    <div className="thought-content">
                      <p className="thought-text">{thought.content.length > 100 ? `${thought.content.substring(0, 100)}...` : thought.content}</p>
                      <div className="thought-meta">
                        <Clock size={12} />
                        <span>{formatTime(thought.timestamp)}</span>
                        {thought.aiResponse && <Heart size={12} className="ai-indicator" />}
                      </div>
                    </div>
                    
                    <div className="thought-actions compact">
                      {!thought.aiResponse && (
                        <button 
                          className="ai-feedback-btn compact"
                          onClick={() => getAIFeedbackHandler(thought)}
                          disabled={isLoadingAI}
                          title="Get AI Feedback"
                        >
                          {isLoadingAI && currentThought?.id === thought.id ? (
                            <LoadingSpinner size="small" text="" />
                          ) : (
                            <Brain size={14} />
                          )}
                        </button>
                      )}
                      
                      <button 
                        className="remove-thought-btn compact"
                        onClick={() => removeThought(thought.id)}
                        title="Remove thought"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Show remaining thoughts when expanded */}
                {showAllThoughts && thoughts.slice(3).map(thought => (
                  <div key={thought.id} className="thought-item compact">
                    <div className="thought-content">
                      <p className="thought-text">{thought.content.length > 100 ? `${thought.content.substring(0, 100)}...` : thought.content}</p>
                      <div className="thought-meta">
                        <Clock size={12} />
                        <span>{formatTime(thought.timestamp)}</span>
                        {thought.aiResponse && <Heart size={12} className="ai-indicator" />}
                      </div>
                    </div>
                    
                    <div className="thought-actions compact">
                      {!thought.aiResponse && (
                        <button 
                          className="ai-feedback-btn compact"
                          onClick={() => getAIFeedbackHandler(thought)}
                          disabled={isLoadingAI}
                          title="Get AI Feedback"
                        >
                          {isLoadingAI && currentThought?.id === thought.id ? (
                            <LoadingSpinner size="small" text="" />
                          ) : (
                            <Brain size={14} />
                          )}
                        </button>
                      )}
                      
                      <button 
                        className="remove-thought-btn compact"
                        onClick={() => removeThought(thought.id)}
                        title="Remove thought"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    {thought.aiResponse && (
                      <div className="ai-response compact">
                        <div className="ai-header">
                          <Heart size={14} />
                          <span>AI Response</span>
                        </div>
                        <p>{thought.aiResponse.length > 150 ? `${thought.aiResponse.substring(0, 150)}...` : thought.aiResponse}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Show expand/collapse indicator */}
                {thoughts.length > 3 && (
                  <div className="expand-indicator">
                    <button 
                      className="expand-btn"
                      onClick={() => setShowAllThoughts(!showAllThoughts)}
                    >
                      {showAllThoughts ? (
                        <>
                          <span>Show Less</span>
                          <span className="arrow">↑</span>
                        </>
                      ) : (
                        <>
                          <span>Show {thoughts.length - 3} More</span>
                          <span className="arrow">↓</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Thought Modal */}
      {showThoughtModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Log Your Thought</h3>
              <button 
                onClick={() => setShowThoughtModal(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <textarea
                value={newThought}
                onChange={(e) => setNewThought(e.target.value)}
                placeholder="What's on your mind? Write it down to gain clarity..."
                rows={4}
              />
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowThoughtModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                onClick={addThought}
                className="save-btn"
                disabled={!newThought.trim()}
              >
                <Plus size={16} />
                Save Thought
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="modal-overlay">
          <div className="modal help-modal">
            <div className="modal-header">
              <h3>
                <BookOpen size={24} />
                Mindfulness Toolkit
              </h3>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Tab Navigation */}
            <div className="help-tabs">
              <button 
                className={`help-tab ${helpTab === 'techniques' ? 'active' : ''}`}
                onClick={() => setHelpTab('techniques')}
              >
                <Target size={16} />
                Techniques
              </button>
              <button 
                className={`help-tab ${helpTab === 'journaling' ? 'active' : ''}`}
                onClick={() => setHelpTab('journaling')}
              >
                <BookOpen size={16} />
                Journaling
              </button>
              <button 
                className={`help-tab ${helpTab === 'mood' ? 'active' : ''}`}
                onClick={() => setHelpTab('mood')}
              >
                <Heart size={16} />
                Mood Tracker
              </button>
              <button 
                className={`help-tab ${helpTab === 'tips' ? 'active' : ''}`}
                onClick={() => setHelpTab('tips')}
              >
                <Lightbulb size={16} />
                Daily Tips
              </button>
              <button 
                className={`help-tab ${helpTab === 'science' ? 'active' : ''}`}
                onClick={() => setHelpTab('science')}
              >
                <Activity size={16} />
                Science
              </button>

              <button 
                className={`help-tab ${helpTab === 'resources' ? 'active' : ''}`}
                onClick={() => setHelpTab('resources')}
              >
                <ExternalLink size={16} />
                Resources
              </button>
            </div>

            <div className="modal-content">
              {/* Techniques Tab */}
              {helpTab === 'techniques' && (
                <div className="techniques-grid">
                  {mindfulnessTechniques.map((technique, index) => (
                    <div 
                      key={index} 
                      className={`technique-card ${activeTechnique?.title === technique.title ? 'active' : ''}`} 
                      style={{ borderLeftColor: technique.color }}
                      onClick={() => technique.interactive && startTechnique(technique)}
                    >
                      <div className="technique-icon" style={{ color: technique.color }}>
                        {technique.icon}
                      </div>
                      <div className="technique-content">
                        <h4>{technique.title}</h4>
                        <p>{technique.description}</p>
                        {technique.interactive && (
                          <button className="start-technique-btn">
                            Start Practice
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Journaling Tab */}
              {helpTab === 'journaling' && (
                <div className="journaling-section">
                  <div className="prompt-section">
                    <h4>Journaling Prompts</h4>
                    <p>Use these prompts to reflect and gain clarity:</p>
                    <div className="prompt-list">
                      {journalingPrompts.map((prompt, index) => (
                        <div key={index} className="prompt-item">
                          <span className="prompt-number">{index + 1}</span>
                          <p>{prompt}</p>
                        </div>
                      ))}
                    </div>
                    <button className="random-prompt-btn" onClick={getRandomPrompt}>
                      <Zap size={16} />
                      Get Random Prompt
                    </button>
                    {selectedPrompt && (
                      <div className="selected-prompt">
                        <h5>Your Prompt:</h5>
                        <p>"{selectedPrompt}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mood Tracker Tab */}
              {helpTab === 'mood' && (
                <div className="mood-section">
                  <div className="current-mood">
                    <h4>How are you feeling?</h4>
                    <div className="mood-grid">
                      {moodTracking.map((mood, index) => (
                        <button
                          key={index}
                          className={`mood-btn ${currentMood?.label === mood.label ? 'selected' : ''}`}
                          onClick={() => addMoodEntry(mood)}
                          style={{ borderColor: mood.color }}
                        >
                          <span className="mood-emoji">{mood.mood}</span>
                          <span className="mood-label">{mood.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {moodHistory.length > 0 && (
                    <div className="mood-history">
                      <h4>Recent Moods</h4>
                      <div className="mood-timeline">
                        {moodHistory.map((entry) => (
                          <div key={entry.id} className="mood-entry">
                            <span className="mood-emoji">{entry.mood}</span>
                            <div className="mood-info">
                              <span className="mood-label">{entry.label}</span>
                              <span className="mood-time">{formatDate(entry.timestamp)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Daily Tips Tab */}
              {helpTab === 'tips' && (
                <div className="tips-section">
                  <h4>Daily Mindfulness Tips</h4>
                  <p>Practical advice to integrate mindfulness into your daily life</p>
                  <div className="tips-grid">
                    {dailyTips.map((tip, index) => (
                      <div key={index} className="tip-card">
                        <div className="tip-header">
                          <h5>{tip.title}</h5>
                          <span className="tip-category">{tip.category}</span>
                        </div>
                        <p>{tip.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Science Tab */}
              {helpTab === 'science' && (
                <div className="science-section">
                  <h4>The Science of Mindfulness</h4>
                  <p>Evidence-based benefits of mindfulness practice</p>
                  <div className="science-grid">
                    {mindfulnessScience.map((study, index) => (
                      <div key={index} className="science-card">
                        <h5>{study.title}</h5>
                        <p>{study.description}</p>
                        <span className="research-source">{study.research}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}



              {/* Resources Tab */}
              {helpTab === 'resources' && (
                <div className="resources-section">
                  <h4>Mindfulness Resources</h4>
                  <div className="resources-grid">
                    <div className="resource-card">
                      <h5>📚 Books</h5>
                      <ul>
                        <li>"The Power of Now" - Eckhart Tolle</li>
                        <li>"Mindfulness in Plain English" - Bhante Gunaratana</li>
                        <li>"Wherever You Go, There You Are" - Jon Kabat-Zinn</li>
                        <li>"The Miracle of Mindfulness" - Thich Nhat Hanh</li>
                        <li>"Radical Acceptance" - Tara Brach</li>
                      </ul>
                    </div>
                    <div className="resource-card">
                      <h5>🎧 Apps</h5>
                      <ul>
                        <li>Headspace</li>
                        <li>Calm</li>
                        <li>Insight Timer</li>
                        <li>Waking Up</li>
                        <li>Ten Percent Happier</li>
                        <li>Simple Habit</li>
                      </ul>
                    </div>
                    <div className="resource-card">
                      <h5>🌐 Websites</h5>
                      <ul>
                        <li>mindful.org</li>
                        <li>greatergood.berkeley.edu</li>
                        <li>mindfulness.org</li>
                        <li>mindfulschools.org</li>
                        <li>mindful.org/meditation</li>
                      </ul>
                    </div>
                    <div className="resource-card">
                      <h5>🎓 Courses</h5>
                      <ul>
                        <li>Mindfulness-Based Stress Reduction (MBSR)</li>
                        <li>Mindfulness-Based Cognitive Therapy (MBCT)</li>
                        <li>Online mindfulness courses</li>
                        <li>Local meditation centers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Active Technique Overlay */}
            {activeTechnique && (
              <div className="technique-overlay">
                <div className="technique-modal">
                  <div className="technique-header">
                    <h3>{activeTechnique.title}</h3>
                    <button onClick={stopTechnique} className="close-technique-btn">
                      <X size={20} />
                    </button>
                  </div>
                  
                  {activeTechnique.type === 'breathing' && isBreathingExercise && (
                    <div className="breathing-exercise">
                      <div className="breathing-circle">
                        <div className={`breathing-animation ${breathingPhase}`}>
                          <span className="breathing-text">
                            {breathingPhase === 'inhale' && 'Inhale'}
                            {breathingPhase === 'hold1' && 'Hold'}
                            {breathingPhase === 'exhale' && 'Exhale'}
                            {breathingPhase === 'hold2' && 'Hold'}
                          </span>
                          <span className="breathing-count">{breathingCountdown}</span>
                        </div>
                      </div>
                      <p className="breathing-instruction">
                        Follow the rhythm: Inhale (4) → Hold (4) → Exhale (4) → Hold (4)
                      </p>
                    </div>
                  )}
                  
                  {activeTechnique.type === 'grounding' && (
                    <div className="grounding-exercise">
                      <h4>5-4-3-2-1 Grounding Exercise</h4>
                      <div className="grounding-steps">
                        <div className="grounding-step">
                          <span className="step-number">5</span>
                          <p>Name 5 things you can see</p>
                        </div>
                        <div className="grounding-step">
                          <span className="step-number">4</span>
                          <p>Name 4 things you can touch</p>
                        </div>
                        <div className="grounding-step">
                          <span className="step-number">3</span>
                          <p>Name 3 things you can hear</p>
                        </div>
                        <div className="grounding-step">
                          <span className="step-number">2</span>
                          <p>Name 2 things you can smell</p>
                        </div>
                        <div className="grounding-step">
                          <span className="step-number">1</span>
                          <p>Name 1 thing you can taste</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTechnique.type === 'meditation' && (
                    <div className="meditation-exercise">
                      <h4>{activeTechnique.title}</h4>
                      <p>{activeTechnique.description}</p>
                      <div className="meditation-timer">
                        <div className="timer-circle">
                          <span className="timer-text">Take your time</span>
                          <span className="timer-subtext">Focus on your breath</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button 
                onClick={() => setShowHelpModal(false)}
                className="save-btn"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Breathing Modal */}
      {showBreathingModal && (
        <div className="modal-overlay">
          <div className="modal breathing-modal">
            <div className="modal-header">
              <h3>
                <Wind size={24} />
                Breathing Exercises
              </h3>
              <button 
                onClick={() => setShowBreathingModal(false)}
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              {!isBreathingExercise ? (
                <div className="breathing-selection">
                  <h4>Choose a Breathing Technique</h4>
                  <p>Select a technique that suits your needs:</p>
                  
                  <div className="technique-options">
                    {Object.entries(breathingTechniques).map(([key, technique]) => (
                      <button
                        key={key}
                        className="technique-option"
                        onClick={() => startBreathingSession(key)}
                        style={{ borderColor: technique.color }}
                      >
                        <div className="technique-header">
                          <h5>{technique.name}</h5>
                          <div className="technique-pattern">
                            {technique.pattern.map((step, index) => (
                              <span key={index} className="pattern-step">
                                {step.duration}s
                              </span>
                            ))}
                          </div>
                        </div>
                        <p>{technique.description}</p>
                        <div className="technique-color" style={{ backgroundColor: technique.color }}></div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="breathing-session">
                  <div className="breathing-visual">
                    <div 
                      className={`breathing-circle ${breathingPhase}`}
                      style={{ 
                        backgroundColor: breathingTechniques[breathingTechnique]?.color,
                        transform: breathingPhase.includes('inhale') ? 'scale(1.2)' : 
                                  breathingPhase.includes('exhale') ? 'scale(0.8)' : 'scale(1)'
                      }}
                    >
                      <div className="breathing-content">
                        <span className="breathing-phase">{getBreathingPhaseText()}</span>
                        <span className="breathing-count">{breathingCountdown}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="breathing-info">
                    <h4>{breathingTechniques[breathingTechnique]?.name}</h4>
                    <p className="breathing-instruction">{getBreathingInstruction()}</p>
                    <div className="breathing-stats">
                      <div className="stat">
                        <span className="stat-label">Breaths</span>
                        <span className="stat-value">{breathCount}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Duration</span>
                        <span className="stat-value">
                          {Math.floor((Date.now() - breathingSession.startTime) / 1000)}s
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="breathing-controls">
                    <button 
                      onClick={stopBreathingSession}
                      className="stop-breathing-btn"
                    >
                      End Session
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Settings Modal */}
      <AccessibilitySettings 
        isOpen={showAccessibilitySettings}
        onClose={() => setShowAccessibilitySettings(false)}
      />

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Music Player */}
      <MusicPlayer 
        isOpen={showMusicPlayer}
        onClose={() => setShowMusicPlayer(false)}
      />

      {/* Draggable AI Chat */}
      <DraggableAIChat 
        isVisible={showDraggableAIChat}
        onClose={() => setShowDraggableAIChat(false)}
        currentThought={currentDifficultThought}
        onThoughtLogged={() => setCurrentDifficultThought(null)}
      />

      {/* Mindfulness Library */}
      <MindfulnessLibrary 
        isOpen={showMindfulnessLibrary}
        onClose={() => setShowMindfulnessLibrary(false)}
        onSelectTechnique={handleTechniqueSelection}
      />

      {/* Onboarding */}
      <Onboarding 
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      {/* Floating AI Help Button */}
      {!showDraggableAIChat && (
        <button
          className="floating-ai-button"
          onClick={() => setShowDraggableAIChat(true)}
          title="Chat with AI Companion"
        >
          <Brain size={20} />
          <span>AI Chat</span>
        </button>
      )}

      {/* Undo Notifications */}
      {settings.showUndo && deletedThoughts.length > 0 && (
        <div className="undo-notifications">
          {deletedThoughts.map(thought => (
            <div key={thought.id} className="undo-notification">
              <span>Thought deleted</span>
              <button 
                onClick={() => undoDelete(thought.id)}
                className="undo-btn"
                aria-label="Undo delete thought"
              >
                <Undo2 size={14} />
                Undo
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 