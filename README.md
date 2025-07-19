# Mindful Journey - AI-Powered Mindfulness App

## Key Features

### AI-Powered Thought Analysis
- **Intelligent AI Chat** - Draggable, floating AI companion that appears for every thought
- **Real-time Guidance** - Instant AI feedback using Google Gemini API
- **Emotional Intelligence** - AI understands context and provides personalized support
- **Conversation History** - Maintains chat context throughout your session

### Smart Thought Logging
- **Automatic AI Response** - Every logged thought triggers immediate AI analysis
- **Pattern Recognition** - AI identifies thought patterns and cognitive distortions
- **Mindfulness Techniques** - Personalized technique recommendations
- **Emotional Validation** - Compassionate, supportive responses

### Interactive UI Features
- **Draggable AI Chat** - Move the AI chat window anywhere on screen
- **Minimize/Maximize** - Collapse or expand the AI chat as needed
- **Floating AI Button** - Always-accessible AI companion
- **Smooth Animations** - Elegant transitions and hover effects

### Advanced Breathing Exercises
- **Multiple Techniques** - Box breathing, 4-7-8, triangle, and alternate nostril
- **Visual Guidance** - Animated breathing circles with real-time feedback
- **Session Tracking** - Monitor your breathing practice progress
- **Customizable Duration** - Adjust sessions to your needs

### Comprehensive Mood Tracking
- **10 Mood Categories** - From happy to stressed, track your emotional journey
- **Visual Mood Grid** - Intuitive emoji-based mood selection
- **Progress Analytics** - Track mood patterns over time
- **Personalized Insights** - AI-powered mood analysis

### Advanced Accessibility
- **Multiple Themes** - Dark, high-contrast, and simplified modes
- **Font Size Control** - Adjustable text sizing for all users
- **Simplified Mode** - Streamlined interface for cognitive accessibility
- **Error Prevention** - Confirmation dialogs and undo functionality
- **Keyboard Navigation** - Full keyboard accessibility support

### Rich Analytics Dashboard
- **Thought Patterns** - Analyze your thinking habits
- **Breathing Progress** - Track your mindfulness practice
- **Mood Trends** - Visualize your emotional journey
- **AI Interaction Stats** - Monitor your AI companion usage

### Mindfulness Library
- **10+ Techniques** - From grounding to loving-kindness meditation
- **Interactive Exercises** - Guided mindfulness practices
- **Difficulty Levels** - Beginner to advanced techniques
- **Duration Options** - Quick 2-minute to extended 30-minute sessions

## Hackathon Ready Features

### Demo Highlights
- **Immediate AI Response** - Every thought triggers sophisticated AI analysis
- **Draggable Interface** - Modern, interactive UI that impresses judges
- **Real-time Processing** - Live AI conversation with context awareness
- **Professional Polish** - Smooth animations and responsive design
- **Accessibility Focus** - Inclusive design that serves all users

### Visual Appeal
- **Dark Theme** - Modern, eye-friendly interface
- **Particle Background** - Dynamic, calming visual effects
- **Smooth Transitions** - Professional-grade animations
- **Mobile Responsive** - Perfect on all devices

## Tech Stack

### Frontend
- **React.js** - Modern component-based architecture
- **React Router** - Seamless navigation
- **Lucide React** - Beautiful, consistent icons
- **CSS3** - Advanced animations and responsive design
- **Local Storage** - Client-side data persistence

### Backend
- **Express.js** - Fast, unopinionated web framework
- **SQLite3** - Lightweight, reliable database
- **bcryptjs** - Secure password hashing
- **CORS** - Cross-origin resource sharing

### AI Integration
- **Google Gemini AI** - Advanced language model for thought analysis
- **Real-time Processing** - Instant AI responses
- **Context Awareness** - Intelligent conversation flow

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### One-Command Setup

1. **Clone and Install:**
```bash
git clone <repository-url>
cd mindfulness-app
npm install
cd backend
npm install
cd ..
```

2. **Configure Environment:**
```bash
# Copy environment template
cp env.example .env

# Edit .env and add your Gemini API key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

3. **Start Both Servers:**
```bash
# Use the provided script to start both servers
chmod +x start-servers.sh
./start-servers.sh
```

Or start manually:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
npm start
```

4. **Access the App:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## How to Use

### For Hackathon Demo:

1. **Show AI Integration:**
   - Log any thought → AI chat automatically appears
   - Drag the chat window around the screen
   - Demonstrate real-time AI conversation

2. **Highlight Accessibility:**
   - Toggle between themes (dark/high-contrast)
   - Adjust font sizes
   - Enable simplified mode

3. **Demonstrate Features:**
   - Start a breathing exercise
   - Track mood with the visual grid
   - Show analytics dashboard

### For Real Users:

1. **Log Your Thoughts** - Every thought gets immediate AI attention
2. **Chat with AI** - Drag the AI chat anywhere and have natural conversations
3. **Practice Breathing** - Choose from multiple guided techniques
4. **Track Your Mood** - Visual mood tracking with progress insights
5. **Explore Techniques** - Access the mindfulness library for guided practices

## Mobile Experience

- **Responsive Design** - Optimized for all screen sizes
- **Touch-Friendly** - Large touch targets and intuitive gestures
- **Simplified Mode** - Streamlined interface for mobile users
- **Offline Capable** - Works with local storage when offline

## Development

### Project Structure:
```
mindfulness-app/
├── src/
│   ├── components/          # React components
│   │   ├── DraggableAIChat.js    # AI chat interface
│   │   ├── Dashboard.js          # Main dashboard
│   │   ├── AccessibilitySettings.js
│   │   └── ...
│   ├── services/            # API services
│   │   ├── geminiService.js      # AI integration
│   │   └── ...
│   ├── contexts/            # React contexts
│   └── ...
├── backend/                 # Express.js server
├── public/                  # Static assets
└── start-servers.sh         # Development script
```

### Key Components:

- **DraggableAIChat** - Intelligent, draggable AI companion
- **Dashboard** - Main application interface
- **AccessibilitySettings** - Theme and accessibility controls
- **geminiService** - Google Gemini AI integration

## Customization

### Themes:
- **Dark Theme** - Default, modern interface
- **High Contrast** - Accessibility-focused design
- **Simplified Mode** - Streamlined for cognitive accessibility

### AI Behavior:
- **Automatic Responses** - AI appears for every thought
- **Contextual Analysis** - Intelligent thought pattern recognition
- **Personalized Guidance** - Tailored mindfulness recommendations

## Deployment

### For Hackathon:
- Use the development servers for live demos
- Ensure your Gemini API key is configured
- Test all features before presentation

### For Production:
- Build the frontend: `npm run build`
- Deploy backend to your preferred hosting service
- Configure environment variables for production

## Performance

- **Fast Loading** - Optimized bundle size
- **Smooth Animations** - 60fps transitions
- **Responsive AI** - Sub-second response times
- **Efficient Storage** - Local storage for offline capability

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

---

**Built with love for mindfulness and mental health awareness**

*Perfect for hackathons, demos, and real-world mindfulness practice*
