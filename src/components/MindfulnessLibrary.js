import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Target, 
  Heart, 
  Brain, 
  Eye,
  Play,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getMindfulnessTechniques } from '../services/geminiService';
import './MindfulnessLibrary.css';

const MindfulnessLibrary = ({ isOpen, onClose, onSelectTechnique }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTechnique, setExpandedTechnique] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const allTechniques = getMindfulnessTechniques();

  // Categories for techniques
  const categories = [
    { id: 'all', name: 'All Techniques', icon: BookOpen },
    { id: 'breathing', name: 'Breathing', icon: Target },
    { id: 'grounding', name: 'Grounding', icon: Eye },
    { id: 'cognitive', name: 'Cognitive', icon: Brain },
    { id: 'compassion', name: 'Compassion', icon: Heart },
    { id: 'quick', name: 'Quick (< 5 min)', icon: Clock }
  ];

  // Categorize techniques
  const categorizedTechniques = allTechniques.map(technique => {
    let category = 'other';
    const name = technique.name.toLowerCase();
    
    if (name.includes('breath')) category = 'breathing';
    else if (name.includes('ground') || name.includes('5-4-3-2-1')) category = 'grounding';
    else if (name.includes('refram') || name.includes('cognitive')) category = 'cognitive';
    else if (name.includes('compassion') || name.includes('gratitude')) category = 'compassion';
    else if (name.includes('quick') || technique.steps.length <= 3) category = 'quick';
    
    return { ...technique, category };
  });

  // Filter techniques based on search and category
  const filteredTechniques = categorizedTechniques.filter(technique => {
    const matchesSearch = technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technique.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || technique.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (techniqueName) => {
    setFavorites(prev => 
      prev.includes(techniqueName) 
        ? prev.filter(name => name !== techniqueName)
        : [...prev, techniqueName]
    );
  };

  const toggleExpanded = (techniqueName) => {
    setExpandedTechnique(expandedTechnique === techniqueName ? null : techniqueName);
  };

  const handleSelectTechnique = (technique) => {
    if (onSelectTechnique) {
      onSelectTechnique(technique);
    }
    onClose();
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="mindfulness-library-overlay" onClick={handleOverlayClick}>
      <div className="mindfulness-library-modal">
        {/* Header */}
        <div className="library-header">
          <div className="library-title">
            <BookOpen size={20} />
            <h2>Mindfulness Techniques Library</h2>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Search and Filters */}
        <div className="library-controls">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search techniques..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="category-filters">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Icon size={14} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Techniques List */}
        <div className="techniques-container">
          {filteredTechniques.length === 0 ? (
            <div className="no-results">
              <BookOpen size={48} />
              <h3>No techniques found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="techniques-grid">
              {filteredTechniques.map((technique, index) => {
                const isExpanded = expandedTechnique === technique.name;
                const isFavorite = favorites.includes(technique.name);
                
                return (
                  <div key={index} className="technique-card-library">
                    <div className="technique-card-header">
                      <div className="technique-info">
                        <h3>{technique.name}</h3>
                        <p>{technique.description}</p>
                        <div className="technique-meta">
                          <span className="technique-category">{technique.category}</span>
                          <span className="technique-duration">
                            <Clock size={12} />
                            {technique.steps.length * 2} min
                          </span>
                        </div>
                      </div>
                      
                      <div className="technique-actions">
                        <button
                          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
                          onClick={() => toggleFavorite(technique.name)}
                          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star size={16} />
                        </button>
                        <button
                          className="expand-btn"
                          onClick={() => toggleExpanded(technique.name)}
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="technique-details">
                        <div className="technique-steps-detailed">
                          <h4>How to practice:</h4>
                          <ol>
                            {technique.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        
                        <div className="technique-tips">
                          <h4>Tips:</h4>
                          <ul>
                            <li>Find a comfortable position</li>
                            <li>Be patient with yourself</li>
                            <li>Practice regularly for best results</li>
                            <li>Don't worry about doing it perfectly</li>
                          </ul>
                        </div>

                        <div className="technique-actions-bottom">
                          <button
                            className="practice-btn"
                            onClick={() => handleSelectTechnique(technique)}
                          >
                            <Play size={14} />
                            Start Practice
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="library-footer">
          <div className="footer-stats">
            <span>{filteredTechniques.length} techniques</span>
            {favorites.length > 0 && (
              <span className="favorites-count">
                {favorites.length} in favorites
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessLibrary; 