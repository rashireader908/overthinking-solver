import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Brain, 
  Heart, 
  Wind, 
  Target,
  BarChart3,
  Activity,
  Award,
  Clock,
  Zap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Minus,
  Filter,
  Download,
  Share2,
  Settings,
  Trophy,
  Star,
  Flame
} from 'lucide-react';
import './Analytics.css';

const Analytics = ({ thoughts, moodHistory, breathingSessions }) => {
  const [timeRange, setTimeRange] = useState('week'); // week, month, all
  const [selectedMetric, setSelectedMetric] = useState('thoughts');
  const [showDetailedCharts, setShowDetailedCharts] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [goals, setGoals] = useState({
    dailyThoughts: 3,
    dailyBreathing: 10,
    weeklyMoodAverage: 4
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('mindfulness_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save goals to localStorage
  const updateGoal = (goalType, value) => {
    const newGoals = { ...goals, [goalType]: value };
    setGoals(newGoals);
    localStorage.setItem('mindfulness_goals', JSON.stringify(newGoals));
  };

  const getTimeRangeData = (data, range) => {
    const now = new Date();
    const ranges = {
      week: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      month: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      all: new Date(0)
    };
    
    return data.filter(item => new Date(item.timestamp || item.created_at) >= ranges[range]);
  };

  const getThoughtStats = () => {
    const filteredThoughts = getTimeRangeData(thoughts, timeRange);
    const totalThoughts = filteredThoughts.length;
    const thoughtsWithAI = filteredThoughts.filter(t => t.aiResponse).length;
    const avgThoughtsPerDay = totalThoughts / Math.max(1, getDaysInRange(timeRange));
    
    // Calculate thought patterns
    const thoughtPatterns = analyzeThoughtPatterns(filteredThoughts);
    
    return {
      total: totalThoughts,
      withAI: thoughtsWithAI,
      aiPercentage: totalThoughts > 0 ? Math.round((thoughtsWithAI / totalThoughts) * 100) : 0,
      perDay: Math.round(avgThoughtsPerDay * 10) / 10,
      patterns: thoughtPatterns,
      goalProgress: Math.round((avgThoughtsPerDay / goals.dailyThoughts) * 100)
    };
  };

  const getMoodStats = () => {
    const filteredMood = getTimeRangeData(moodHistory, timeRange);
    if (filteredMood.length === 0) return null;
    
    const moodScores = {
      '😊': 5, '😌': 4, '😐': 3, '😔': 2, '😰': 1, '😤': 1
    };
    
    const avgScore = filteredMood.reduce((sum, entry) => 
      sum + (moodScores[entry.mood] || 3), 0) / filteredMood.length;
    
    const moodTrend = filteredMood.length > 1 ? 
      (moodScores[filteredMood[0].mood] - moodScores[filteredMood[filteredMood.length - 1].mood]) : 0;
    
    const moodDistribution = getMoodDistribution(filteredMood);
    
    return {
      total: filteredMood.length,
      average: Math.round(avgScore * 10) / 10,
      trend: moodTrend,
      mostFrequent: getMostFrequentMood(filteredMood),
      distribution: moodDistribution,
      goalProgress: Math.round((avgScore / goals.weeklyMoodAverage) * 100)
    };
  };

  const getBreathingStats = () => {
    const filteredSessions = getTimeRangeData(breathingSessions || [], timeRange);
    const totalSessions = filteredSessions.length;
    const totalDuration = filteredSessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
    const avgDailyMinutes = Math.round((totalDuration / 60) / Math.max(1, getDaysInRange(timeRange)));
    
    const techniqueUsage = getTechniqueUsage(filteredSessions);
    
    return {
      total: totalSessions,
      totalDuration: Math.round(totalDuration / 60), // in minutes
      avgDuration: avgDuration,
      perDay: Math.round((totalSessions / Math.max(1, getDaysInRange(timeRange))) * 10) / 10,
      avgDailyMinutes: avgDailyMinutes,
      techniqueUsage: techniqueUsage,
      goalProgress: Math.round((avgDailyMinutes / goals.dailyBreathing) * 100)
    };
  };

  const getDaysInRange = (range) => {
    const ranges = { week: 7, month: 30, all: 365 };
    return ranges[range];
  };

  const getMostFrequentMood = (moodData) => {
    const counts = {};
    moodData.forEach(entry => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  const getMoodDistribution = (moodData) => {
    const counts = {};
    moodData.forEach(entry => {
      counts[entry.mood] = (counts[entry.mood] || 0) + 1;
    });
    return counts;
  };

  const getTechniqueUsage = (sessions) => {
    const counts = {};
    sessions.forEach(session => {
      counts[session.technique] = (counts[session.technique] || 0) + 1;
    });
    return counts;
  };

  const analyzeThoughtPatterns = (thoughts) => {
    const patterns = {
      anxiety: 0,
      perfectionism: 0,
      futureWorry: 0,
      selfCriticism: 0,
      comparison: 0
    };

    const anxietyKeywords = ['worry', 'anxious', 'stress', 'fear', 'panic', 'nervous'];
    const perfectionismKeywords = ['perfect', 'should', 'must', 'failure', 'mistake'];
    const futureKeywords = ['what if', 'future', 'tomorrow', 'later', 'planning'];
    const criticismKeywords = ['stupid', 'failure', 'wrong', 'bad', 'terrible'];
    const comparisonKeywords = ['better', 'worse', 'compare', 'others', 'everyone else'];

    thoughts.forEach(thought => {
      const content = thought.content.toLowerCase();
      
      if (anxietyKeywords.some(keyword => content.includes(keyword))) patterns.anxiety++;
      if (perfectionismKeywords.some(keyword => content.includes(keyword))) patterns.perfectionism++;
      if (futureKeywords.some(keyword => content.includes(keyword))) patterns.futureWorry++;
      if (criticismKeywords.some(keyword => content.includes(keyword))) patterns.selfCriticism++;
      if (comparisonKeywords.some(keyword => content.includes(keyword))) patterns.comparison++;
    });

    return patterns;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return <ChevronUp size={16} className="trend-up" />;
    if (trend < 0) return <ChevronDown size={16} className="trend-down" />;
    return <Minus size={16} className="trend-neutral" />;
  };

  const getAchievementBadges = () => {
    const badges = [];
    const thoughtStats = getThoughtStats();
    const moodStats = getMoodStats();
    const breathingStats = getBreathingStats();

    if (thoughtStats.total >= 50) badges.push({ type: 'thoughts', icon: <Brain size={20} />, text: 'Thought Explorer' });
    if (thoughtStats.aiPercentage >= 80) badges.push({ type: 'ai', icon: <Zap size={20} />, text: 'AI Guide Seeker' });
    if (breathingStats.total >= 20) badges.push({ type: 'breathing', icon: <Wind size={20} />, text: 'Breathing Master' });
    if (moodStats && moodStats.average >= 4) badges.push({ type: 'mood', icon: <Heart size={20} />, text: 'Mood Champion' });
    if (thoughtStats.goalProgress >= 100) badges.push({ type: 'goal', icon: <Target size={20} />, text: 'Goal Achiever' });

    return badges;
  };

  const thoughtStats = getThoughtStats();
  const moodStats = getMoodStats();
  const breathingStats = getBreathingStats();
  const achievements = getAchievementBadges();

  const metrics = [
    {
      id: 'thoughts',
      title: 'Thought Patterns',
      icon: <Brain size={24} />,
      color: '#9f7aea',
      stats: thoughtStats
    },
    {
      id: 'mood',
      title: 'Mood Tracking',
      icon: <Heart size={24} />,
      color: '#f56565',
      stats: moodStats
    },
    {
      id: 'breathing',
      title: 'Breathing Practice',
      icon: <Wind size={24} />,
      color: '#48bb78',
      stats: breathingStats
    }
  ];

  const renderMetricCard = (metric) => {
    if (!metric.stats) return null;

    return (
      <div key={metric.id} className="metric-card" style={{ borderColor: metric.color }}>
        <div className="metric-header">
          <div className="metric-icon" style={{ backgroundColor: metric.color }}>
            {metric.icon}
          </div>
          <div className="metric-title-section">
            <h3>{metric.title}</h3>
            {metric.stats.goalProgress && (
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${Math.min(metric.stats.goalProgress, 100)}%`,
                      backgroundColor: metric.color 
                    }}
                  ></div>
                </div>
                <span className="progress-text">{Math.min(metric.stats.goalProgress, 100)}%</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="metric-stats">
          {metric.id === 'thoughts' && (
            <>
              <div className="stat">
                <span className="stat-value">{metric.stats.total}</span>
                <span className="stat-label">Total Thoughts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{metric.stats.aiPercentage}%</span>
                <span className="stat-label">With AI Guidance</span>
              </div>
              <div className="stat">
                <span className="stat-value">{metric.stats.perDay}</span>
                <span className="stat-label">Per Day</span>
              </div>
            </>
          )}
          
          {metric.id === 'mood' && (
            <>
              <div className="stat">
                <span className="stat-value">{metric.stats.average}/5</span>
                <span className="stat-label">Average Mood</span>
              </div>
              <div className="stat">
                <span className="stat-value">{metric.stats.total}</span>
                <span className="stat-label">Entries</span>
              </div>
              <div className="stat">
                <span className="stat-value">{metric.stats.mostFrequent}</span>
                <span className="stat-label">Most Frequent</span>
              </div>
            </>
          )}
          
          {metric.id === 'breathing' && (
            <>
              <div className="stat">
                <span className="stat-value">{metric.stats.total}</span>
                <span className="stat-label">Sessions</span>
              </div>
              <div className="stat">
                <span className="stat-value">{metric.stats.totalDuration}m</span>
                <span className="stat-label">Total Time</span>
              </div>
              <div className="stat">
                <span className="stat-value">{metric.stats.avgDailyMinutes}m</span>
                <span className="stat-label">Daily Average</span>
              </div>
            </>
          )}
        </div>

        {metric.stats.patterns && (
          <div className="patterns-section">
            <h4>Thought Patterns</h4>
            <div className="pattern-bars">
              {Object.entries(metric.stats.patterns).map(([pattern, count]) => (
                <div key={pattern} className="pattern-bar">
                  <span className="pattern-label">{pattern}</span>
                  <div className="pattern-progress">
                    <div 
                      className="pattern-fill" 
                      style={{ 
                        width: `${(count / Math.max(1, metric.stats.total)) * 100}%`,
                        backgroundColor: metric.color 
                      }}
                    ></div>
                  </div>
                  <span className="pattern-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDetailedCharts = () => {
    if (!showDetailedCharts) return null;

    return (
      <div className="detailed-charts">
        <h3>Detailed Analysis</h3>
        
        {/* Mood Distribution Chart */}
        {moodStats && (
          <div className="chart-section">
            <h4>Mood Distribution</h4>
            <div className="mood-chart">
              {Object.entries(moodStats.distribution).map(([mood, count]) => (
                <div key={mood} className="mood-bar">
                  <span className="mood-emoji">{mood}</span>
                  <div className="mood-progress">
                    <div 
                      className="mood-fill" 
                      style={{ 
                        width: `${(count / moodStats.total) * 100}%`,
                        backgroundColor: '#f56565'
                      }}
                    ></div>
                  </div>
                  <span className="mood-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Breathing Technique Usage */}
        {breathingStats.techniqueUsage && (
          <div className="chart-section">
            <h4>Breathing Techniques Used</h4>
            <div className="technique-chart">
              {Object.entries(breathingStats.techniqueUsage).map(([technique, count]) => (
                <div key={technique} className="technique-bar">
                  <span className="technique-label">{technique}</span>
                  <div className="technique-progress">
                    <div 
                      className="technique-fill" 
                      style={{ 
                        width: `${(count / breathingStats.total) * 100}%`,
                        backgroundColor: '#48bb78'
                      }}
                    ></div>
                  </div>
                  <span className="technique-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGoalsSection = () => (
    <div className="goals-section">
      <h3>Your Goals</h3>
      <div className="goals-grid">
        <div className="goal-card">
          <div className="goal-header">
            <Target size={20} />
            <span>Daily Thoughts</span>
          </div>
          <div className="goal-control">
            <input
              type="number"
              value={goals.dailyThoughts}
              onChange={(e) => updateGoal('dailyThoughts', parseInt(e.target.value) || 0)}
              min="1"
              max="20"
            />
            <span>thoughts/day</span>
          </div>
        </div>
        
        <div className="goal-card">
          <div className="goal-header">
            <Wind size={20} />
            <span>Daily Breathing</span>
          </div>
          <div className="goal-control">
            <input
              type="number"
              value={goals.dailyBreathing}
              onChange={(e) => updateGoal('dailyBreathing', parseInt(e.target.value) || 0)}
              min="1"
              max="60"
            />
            <span>minutes/day</span>
          </div>
        </div>
        
        <div className="goal-card">
          <div className="goal-header">
            <Heart size={20} />
            <span>Weekly Mood</span>
          </div>
          <div className="goal-control">
            <input
              type="number"
              value={goals.weeklyMoodAverage}
              onChange={(e) => updateGoal('weeklyMoodAverage', parseFloat(e.target.value) || 0)}
              min="1"
              max="5"
              step="0.1"
            />
            <span>average</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="achievements-section">
      <h3>Achievements</h3>
      <div className="achievements-grid">
        {achievements.map((badge, index) => (
          <div key={index} className="achievement-badge">
            <div className="badge-icon">{badge.icon}</div>
            <span className="badge-text">{badge.text}</span>
          </div>
        ))}
        {achievements.length === 0 && (
          <p className="no-achievements">Keep practicing to earn your first achievement!</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h3 className="analytics-title">
          <BarChart3 size={16} />
          Analytics Dashboard
        </h3>
      </div>
      
      <div className="analytics-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{thoughtStats.total}</div>
            <div className="stat-label">Total Thoughts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{thoughtStats.aiPercentage}%</div>
            <div className="stat-label">With AI Guidance</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{moodStats ? moodStats.average : 'N/A'}</div>
            <div className="stat-label">Avg Mood Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{breathingStats.totalDuration}</div>
            <div className="stat-label">Breathing Minutes</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-header">
            <h4 className="charts-title">Activity Overview</h4>
          </div>
          <div className="chart-container">
            <h5 className="chart-title">Thought Patterns</h5>
            <div className="simple-chart">
              {Object.entries(thoughtStats.patterns).map(([pattern, count]) => (
                <div key={pattern} style={{ margin: '4px 0' }}>
                  {pattern}: {count} thoughts
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Section */}
        <div className="goals-section">
          <div className="goals-header">
            <h4 className="goals-title">Your Goals</h4>
            <button className="add-goal-btn">Add Goal</button>
          </div>
          <div className="goals-grid">
            <div className="goal-card">
              <div className="goal-header">
                <h5 className="goal-title">Daily Thoughts</h5>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(thoughtStats.goalProgress, 100)}%` }}
                  />
                </div>
                <div className="progress-text">
                  {thoughtStats.perDay} / {goals.dailyThoughts} thoughts per day
                </div>
              </div>
              <div className="goal-actions">
                <button className="goal-btn">Edit</button>
                <button className="goal-btn primary">Update</button>
              </div>
            </div>
            
            <div className="goal-card">
              <div className="goal-header">
                <h5 className="goal-title">Daily Breathing</h5>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(breathingStats.goalProgress, 100)}%` }}
                  />
                </div>
                <div className="progress-text">
                  {breathingStats.avgDailyMinutes} / {goals.dailyBreathing} minutes per day
                </div>
              </div>
              <div className="goal-actions">
                <button className="goal-btn">Edit</button>
                <button className="goal-btn primary">Update</button>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="achievements-section">
          <div className="achievements-header">
            <h4 className="achievements-title">Achievements</h4>
          </div>
          <div className="achievements-grid">
            {achievements.map((badge, index) => (
              <div key={index} className="achievement-card earned">
                <div className="achievement-icon">{badge.icon}</div>
                <div className="achievement-title">{badge.text}</div>
                <div className="achievement-desc">Earned!</div>
              </div>
            ))}
            {achievements.length === 0 && (
              <div className="achievement-card">
                <div className="achievement-icon">🎯</div>
                <div className="achievement-title">First Steps</div>
                <div className="achievement-desc">Log your first thought</div>
              </div>
            )}
          </div>
        </div>

        {/* Thought Patterns Section */}
        <div className="patterns-section">
          <div className="patterns-header">
            <h4 className="patterns-title">Thought Patterns</h4>
          </div>
          <div className="patterns-grid">
            {Object.entries(thoughtStats.patterns).map(([pattern, count]) => (
              <div key={pattern} className="pattern-card">
                <div className="pattern-header">
                  <div className={`pattern-icon ${pattern === 'anxiety' ? 'negative' : pattern === 'perfectionism' ? 'negative' : 'neutral'}`}>
                    {pattern === 'anxiety' ? '😰' : pattern === 'perfectionism' ? '🎯' : '💭'}
                  </div>
                  <div className="pattern-title">{pattern}</div>
                </div>
                <div className="pattern-count">{count} thoughts</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 