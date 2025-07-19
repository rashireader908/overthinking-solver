const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // User authentication
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Thoughts
  static async saveThought(thoughtData) {
    try {
      const response = await fetch(`${API_BASE_URL}/thoughts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(thoughtData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save thought');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getThoughts(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/thoughts/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch thoughts');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Breathing sessions
  static async saveBreathingSession(sessionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/breathing-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save breathing session');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Mood entries
  static async saveMoodEntry(moodData) {
    try {
      const response = await fetch(`${API_BASE_URL}/mood-entries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moodData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save mood entry');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getMoodEntries(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/mood-entries/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch mood entries');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // User stats
  static async getUserStats(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-stats/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user stats');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Health check
  static async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Server is not responding');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default ApiService; 