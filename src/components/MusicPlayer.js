import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  X,
  Move
} from 'lucide-react';
import { musicTracks } from '../services/musicService';
import './MusicPlayer.css';

const MusicPlayer = ({ isOpen, onClose }) => {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none'); // none, one, all
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const playerRef = useRef(null);

  // Use tracks from music service
  const tracks = musicTracks;

  // Load favorites and position from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('music_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedPosition = localStorage.getItem('music_player_position');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  // Save favorites and position to localStorage
  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem('music_favorites', JSON.stringify(newFavorites));
  };

  const savePosition = (newPosition) => {
    setPosition(newPosition);
    localStorage.setItem('music_player_position', JSON.stringify(newPosition));
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].url;
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentTrack]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Drag functionality
  const handleMouseDown = (e) => {
    if (e.target.closest('.music-controls, .progress-container, .volume-control')) {
      return; // Don't drag if clicking on controls
    }
    
    setIsDragging(true);
    const rect = playerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep player within viewport bounds
    const maxX = window.innerWidth - (playerRef.current?.offsetWidth || 300);
    const maxY = window.innerHeight - (playerRef.current?.offsetHeight || 400);
    
    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));
    
    setPosition({ x: boundedX, y: boundedY });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(position);
    }
  };

  // Add global mouse event listeners
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

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack(prev => prev === 0 ? tracks.length - 1 : prev - 1);
    }
  };

  const handleNext = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack(prev => (prev + 1) % tracks.length);
    }
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFavorite = (trackId) => {
    const newFavorites = favorites.includes(trackId)
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];
    saveFavorites(newFavorites);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTrackData = tracks[currentTrack];

  if (!isOpen) return null;

  return (
    <div 
      className="music-player-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={playerRef}
        className={`music-player ${isDragging ? 'dragging' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
        onMouseDown={handleMouseDown}
      >
        <div className="music-header">
          <div className="music-title-section">
            <Move size={14} className="drag-handle" />
            <h3 className="music-title">
              <Music size={16} />
              Classical Music
            </h3>
          </div>
          <button className="close-music-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        <div className="music-content">
          <div className="track-display">
            <img 
              src={currentTrackData.cover} 
              alt={currentTrackData.title} 
              className="track-cover"
            />
            <div className="track-info">
              <h4 className="track-title">{currentTrackData.title}</h4>
              <p className="track-artist">{currentTrackData.artist}</p>
              <p className="track-description">{currentTrackData.description}</p>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="progress-bar" ref={progressRef} onClick={handleProgressClick}>
              <div 
                className="progress-fill" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="music-controls">
            <button 
              className="control-btn" 
              onClick={handlePrevious}
              disabled={tracks.length <= 1}
            >
              <SkipBack size={16} />
            </button>
            <button className="play-pause-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button 
              className="control-btn" 
              onClick={handleNext}
              disabled={tracks.length <= 1}
            >
              <SkipForward size={16} />
            </button>
          </div>
          
          <div className="volume-control">
            <span className="volume-icon">
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </span>
            <div className="volume-slider" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              setVolume(percent);
              setIsMuted(false);
            }}>
              <div 
                className="volume-fill" 
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
          </div>
          
          <div className="playlist-section">
            <div className="playlist-header">
              <h4 className="playlist-title">Classical Playlist</h4>
              <div className="playlist-controls">
                <button 
                  className={`playlist-btn ${shuffle ? 'active' : ''}`}
                  onClick={() => setShuffle(!shuffle)}
                  title={shuffle ? "Disable shuffle" : "Enable shuffle"}
                >
                  <Shuffle size={14} />
                </button>
                <button 
                  className={`playlist-btn ${repeat !== 'none' ? 'active' : ''}`}
                  onClick={() => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none')}
                  title={`Repeat: ${repeat}`}
                >
                  <Repeat size={14} />
                </button>
              </div>
            </div>
            
            <div className="track-list">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`track-item ${index === currentTrack ? 'active' : ''}`}
                  onClick={() => setCurrentTrack(index)}
                >
                  <img 
                    src={track.cover} 
                    alt={track.title} 
                    className="track-item-cover"
                  />
                  <div className="track-item-info">
                    <div className="track-item-title">{track.title}</div>
                    <div className="track-item-artist">{track.artist}</div>
                  </div>
                  <div className="track-item-duration">
                    {track.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Hidden audio element */}
        <audio ref={audioRef} preload="metadata" />
      </div>
    </div>
  );
};

export default MusicPlayer; 