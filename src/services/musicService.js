// Music Service for Mindfulness App
// Provides copyright-free classical music tracks

export const musicTracks = [
  {
    id: 1,
    title: "Moonlight Sonata",
    artist: "Ludwig van Beethoven",
    duration: "5:32",
    category: "Piano",
    mood: "Calm",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/beethoven_moonlight_sonata.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
    description: "A gentle piano piece perfect for meditation and reflection"
  },
  {
    id: 2,
    title: "Air on the G String",
    artist: "Johann Sebastian Bach",
    duration: "4:18",
    category: "Orchestral",
    mood: "Peaceful",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/bach_air_on_g_string.mp3",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center",
    description: "A serene orchestral piece that promotes inner peace"
  },
  {
    id: 3,
    title: "Claire de Lune",
    artist: "Claude Debussy",
    duration: "6:45",
    category: "Piano",
    mood: "Dreamy",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/debussy_claire_de_lune.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
    description: "A dreamy piano composition that transports you to a peaceful state"
  },
  {
    id: 4,
    title: "Canon in D",
    artist: "Johann Pachelbel",
    duration: "5:12",
    category: "Strings",
    mood: "Harmonious",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/pachelbel_canon_in_d.mp3",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center",
    description: "A harmonious string piece that creates a sense of balance"
  },
  {
    id: 5,
    title: "Gymnopédie No. 1",
    artist: "Erik Satie",
    duration: "3:28",
    category: "Piano",
    mood: "Meditative",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/satie_gymnopedie_no1.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
    description: "A minimalist piano piece ideal for deep meditation"
  },
  {
    id: 6,
    title: "The Four Seasons - Spring",
    artist: "Antonio Vivaldi",
    duration: "4:55",
    category: "Orchestral",
    mood: "Uplifting",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/vivaldi_spring.mp3",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center",
    description: "An uplifting orchestral piece that brings joy and energy"
  },
  {
    id: 7,
    title: "Nocturne in E-flat",
    artist: "Frédéric Chopin",
    duration: "4:42",
    category: "Piano",
    mood: "Romantic",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/chopin_nocturne_eb.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
    description: "A romantic piano nocturne perfect for evening relaxation"
  },
  {
    id: 8,
    title: "Adagio for Strings",
    artist: "Samuel Barber",
    duration: "8:15",
    category: "Strings",
    mood: "Contemplative",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/barber_adagio_strings.mp3",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center",
    description: "A contemplative string piece for deep reflection"
  },
  {
    id: 9,
    title: "Für Elise",
    artist: "Ludwig van Beethoven",
    duration: "3:45",
    category: "Piano",
    mood: "Gentle",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/beethoven_fur_elise.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center",
    description: "A gentle piano piece that soothes the mind"
  },
  {
    id: 10,
    title: "Ave Maria",
    artist: "Franz Schubert",
    duration: "5:18",
    category: "Vocal",
    mood: "Spiritual",
    url: "https://www.chosic.com/wp-content/uploads/2023/07/schubert_ave_maria.mp3",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center",
    description: "A spiritual vocal piece that connects with inner peace"
  }
];

// Get tracks by category
export const getTracksByCategory = (category) => {
  return musicTracks.filter(track => track.category === category);
};

// Get tracks by mood
export const getTracksByMood = (mood) => {
  return musicTracks.filter(track => track.mood === mood);
};

// Get random track
export const getRandomTrack = () => {
  const randomIndex = Math.floor(Math.random() * musicTracks.length);
  return musicTracks[randomIndex];
};

// Get track by ID
export const getTrackById = (id) => {
  return musicTracks.find(track => track.id === id);
};

// Get recommended tracks based on current mood
export const getRecommendedTracks = (currentMood) => {
  const moodMap = {
    '😊': ['Uplifting', 'Harmonious'],
    '😌': ['Calm', 'Peaceful'],
    '😐': ['Meditative', 'Gentle'],
    '😔': ['Contemplative', 'Calm'],
    '😰': ['Peaceful', 'Gentle'],
    '😤': ['Uplifting', 'Harmonious']
  };
  
  const recommendedMoods = moodMap[currentMood] || ['Calm', 'Peaceful'];
  return musicTracks.filter(track => recommendedMoods.includes(track.mood));
};

// Get meditation playlist
export const getMeditationPlaylist = () => {
  return musicTracks.filter(track => 
    ['Meditative', 'Calm', 'Peaceful', 'Contemplative'].includes(track.mood)
  );
};

// Get focus playlist
export const getFocusPlaylist = () => {
  return musicTracks.filter(track => 
    ['Harmonious', 'Gentle', 'Calm'].includes(track.mood)
  );
};

// Get relaxation playlist
export const getRelaxationPlaylist = () => {
  return musicTracks.filter(track => 
    ['Peaceful', 'Dreamy', 'Gentle'].includes(track.mood)
  );
}; 