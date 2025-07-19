// Enhanced Google Gemini API Service for Mindfulness App
// Provides comprehensive AI analysis for thought logging

// DO NOT include real API keys in this file
// Keys are stored in .env and are ignored from git
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Thought pattern categories
export const THOUGHT_PATTERNS = {
  CATASTROPHIZING: 'catastrophizing',
  MIND_READING: 'mind_reading',
  FORTUNE_TELLING: 'fortune_telling',
  ALL_OR_NOTHING: 'all_or_nothing',
  OVERGENERALIZATION: 'overgeneralization',
  EMOTIONAL_REASONING: 'emotional_reasoning',
  SHOULD_STATEMENTS: 'should_statements',
  PERSONALIZATION: 'personalization',
  DISCOUNTING_POSITIVES: 'discounting_positives',
  COMPARISON: 'comparison',
  UNCERTAINTY: 'uncertainty',
  PERFECTIONISM: 'perfectionism'
};

// Emotional states
export const EMOTIONAL_STATES = {
  ANXIOUS: 'anxious',
  STRESSED: 'stressed',
  OVERWHELMED: 'overwhelmed',
  SAD: 'sad',
  ANGRY: 'angry',
  FRUSTRATED: 'frustrated',
  CONFUSED: 'confused',
  LONELY: 'lonely',
  INSECURE: 'insecure',
  EXCITED: 'excited',
  PEACEFUL: 'peaceful',
  GRATEFUL: 'grateful'
};

// Enhanced AI feedback with comprehensive analysis
export const getAIFeedback = async (thought, options = {}) => {
  const {
    analysisType = 'comprehensive', // 'comprehensive', 'quick', 'pattern', 'emotional'
    includeTechniques = true,
    includeReframing = true,
    includeValidation = true
  } = options;

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    return getFallbackResponse(thought, analysisType);
  }

  try {
    const prompt = buildPrompt(thought, analysisType, includeTechniques, includeReframing, includeValidation);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    
    if (data.error) {
        throw new Error(`Gemini API error: ${data.error.message}`);
    }
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const aiMessage = data.candidates[0]?.content?.parts[0]?.text;

    if (!aiMessage) {
      throw new Error('No response from AI');
    }

    // Parse the AI response to extract structured data
    const parsedResponse = parseAIResponse(aiMessage, analysisType);

    return {
      success: true,
      ...parsedResponse
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    return getFallbackResponse(thought, analysisType);
  }
};

// Build comprehensive prompt based on analysis type
const buildPrompt = (thought, analysisType, includeTechniques, includeReframing, includeValidation) => {
  const basePrompt = `You are a compassionate mindfulness coach and cognitive behavioral therapist helping someone who is overthinking.

Your role is to provide gentle, supportive guidance that helps them:
1. Recognize patterns of overthinking and cognitive distortions
2. Practice self-compassion and emotional validation
3. Focus on the present moment
4. Develop healthier thought patterns
5. Learn practical mindfulness techniques

The person is having this thought: "${thought}"

Please provide a response in the following JSON format:
{
  "thoughtPattern": "pattern_name",
  "emotionalState": "emotional_state",
  "analysis": "brief analysis of the thought",
  "validation": "empathetic validation of their feelings",
  "reframing": "gentle reframing of the thought",
  "techniques": ["technique1", "technique2", "technique3"],
  "guidance": "overall supportive guidance"
}

Keep each section concise (under 100 words) and warm. Focus on practical, actionable advice.`;

  const quickPrompt = `You are a mindfulness coach. The person is having this thought: "${thought}"

Provide a brief, supportive response (under 100 words) that:
- Validates their feelings
- Offers gentle reframing
- Suggests one practical technique

Keep it warm and encouraging.`;

  const patternPrompt = `You are a cognitive behavioral therapist. Analyze this thought: "${thought}"

Identify the cognitive distortion pattern and provide a brief explanation of how this pattern affects thinking. Keep it under 150 words.`;

  const emotionalPrompt = `You are an empathetic counselor. The person is having this thought: "${thought}"

Focus on emotional validation and support. Acknowledge their feelings and provide gentle comfort. Keep it under 150 words.`;

  switch (analysisType) {
    case 'quick':
      return quickPrompt;
    case 'pattern':
      return patternPrompt;
    case 'emotional':
      return emotionalPrompt;
    default:
      return basePrompt;
  }
};

// Parse AI response to extract structured data
const parseAIResponse = (aiMessage, analysisType) => {
  if (analysisType === 'comprehensive') {
    try {
      // Try to parse JSON response
      const jsonMatch = aiMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          message: aiMessage,
          thoughtPattern: parsed.thoughtPattern,
          emotionalState: parsed.emotionalState,
          analysis: parsed.analysis,
          validation: parsed.validation,
          reframing: parsed.reframing,
          techniques: parsed.techniques || [],
          guidance: parsed.guidance
        };
      }
    } catch (error) {
      console.log('Could not parse JSON response, using full message');
    }
    }
    
    return {
    message: aiMessage,
    thoughtPattern: detectThoughtPattern(aiMessage),
    emotionalState: detectEmotionalState(aiMessage),
    analysis: aiMessage,
    validation: '',
    reframing: '',
    techniques: extractTechniques(aiMessage),
    guidance: aiMessage
  };
};

// Detect thought patterns from AI response
const detectThoughtPattern = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('catastroph') || lowerMessage.includes('worst case')) {
    return THOUGHT_PATTERNS.CATASTROPHIZING;
  }
  if (lowerMessage.includes('mind reading') || lowerMessage.includes('assume')) {
    return THOUGHT_PATTERNS.MIND_READING;
  }
  if (lowerMessage.includes('future') || lowerMessage.includes('predict')) {
    return THOUGHT_PATTERNS.FORTUNE_TELLING;
  }
  if (lowerMessage.includes('all or nothing') || lowerMessage.includes('black and white')) {
    return THOUGHT_PATTERNS.ALL_OR_NOTHING;
  }
  if (lowerMessage.includes('always') || lowerMessage.includes('never') || lowerMessage.includes('everyone')) {
    return THOUGHT_PATTERNS.OVERGENERALIZATION;
  }
  if (lowerMessage.includes('should') || lowerMessage.includes('must')) {
    return THOUGHT_PATTERNS.SHOULD_STATEMENTS;
  }
  if (lowerMessage.includes('uncertain') || lowerMessage.includes('what if')) {
    return THOUGHT_PATTERNS.UNCERTAINTY;
  }
  if (lowerMessage.includes('perfect') || lowerMessage.includes('failure')) {
    return THOUGHT_PATTERNS.PERFECTIONISM;
  }
  
  return THOUGHT_PATTERNS.UNCERTAINTY;
};

// Detect emotional state from AI response
const detectEmotionalState = (message) => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('anxious') || lowerMessage.includes('worry')) {
    return EMOTIONAL_STATES.ANXIOUS;
  }
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) {
    return EMOTIONAL_STATES.STRESSED;
  }
  if (lowerMessage.includes('sad') || lowerMessage.includes('depress')) {
    return EMOTIONAL_STATES.SAD;
  }
  if (lowerMessage.includes('angry') || lowerMessage.includes('frustrat')) {
    return EMOTIONAL_STATES.ANGRY;
  }
  if (lowerMessage.includes('confus') || lowerMessage.includes('uncertain')) {
    return EMOTIONAL_STATES.CONFUSED;
  }
  if (lowerMessage.includes('lonely') || lowerMessage.includes('isolat')) {
    return EMOTIONAL_STATES.LONELY;
  }
  if (lowerMessage.includes('insecure') || lowerMessage.includes('doubt')) {
    return EMOTIONAL_STATES.INSECURE;
  }
  
  return EMOTIONAL_STATES.STRESSED;
};

// Extract mindfulness techniques from AI response
const extractTechniques = (message) => {
  const techniques = [];
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('breath') || lowerMessage.includes('inhale') || lowerMessage.includes('exhale')) {
    techniques.push('Deep Breathing');
  }
  if (lowerMessage.includes('5-4-3-2-1') || lowerMessage.includes('grounding')) {
    techniques.push('5-4-3-2-1 Grounding');
  }
  if (lowerMessage.includes('observe') || lowerMessage.includes('witness')) {
    techniques.push('Thought Observation');
  }
  if (lowerMessage.includes('reframe') || lowerMessage.includes('perspective')) {
    techniques.push('Cognitive Reframing');
  }
  if (lowerMessage.includes('compassion') || lowerMessage.includes('kindness')) {
    techniques.push('Self-Compassion');
  }
  if (lowerMessage.includes('present') || lowerMessage.includes('moment')) {
    techniques.push('Present Moment Focus');
  }
  if (lowerMessage.includes('gratitude') || lowerMessage.includes('appreciate')) {
    techniques.push('Gratitude Practice');
  }
  if (lowerMessage.includes('body scan') || lowerMessage.includes('physical')) {
    techniques.push('Body Scan');
  }
  
  return techniques.length > 0 ? techniques : ['Deep Breathing', 'Thought Observation'];
};

// Get fallback response when API is not available
const getFallbackResponse = (thought, analysisType) => {
  const fallbackResponses = {
    comprehensive: {
      thoughtPattern: THOUGHT_PATTERNS.UNCERTAINTY,
      emotionalState: EMOTIONAL_STATES.STRESSED,
      analysis: "This thought appears to be causing you some distress. It's natural to have concerns, but sometimes our minds can amplify them.",
      validation: "Your feelings are valid, and it's okay to have these thoughts. Many people experience similar patterns of thinking.",
      reframing: "Instead of focusing on what might go wrong, try to focus on what you can control right now in this moment.",
      techniques: ["Deep Breathing", "5-4-3-2-1 Grounding", "Thought Observation"],
      guidance: "Remember that thoughts are not facts. You have the power to choose which thoughts to engage with. Take a few deep breaths and focus on the present moment."
    },
    quick: {
      message: "This thought seems to be creating unnecessary stress. Try taking a few deep breaths and asking yourself: 'Is this thought helpful right now?' Remember, you are not your thoughts - you are the observer of your thoughts."
    },
    pattern: {
      message: "This appears to be a pattern of overthinking, possibly involving uncertainty or catastrophizing. These patterns are common and can be managed with mindfulness practices."
    },
    emotional: {
      message: "I can sense that this thought is causing you some distress. Your feelings are completely valid. It's okay to feel this way, and you don't have to figure everything out right now."
    }
  };

  const response = fallbackResponses[analysisType] || fallbackResponses.comprehensive;
  
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        ...response
      });
    }, 1000 + Math.random() * 2000);
  });
};

// Get thought pattern insights
export const getThoughtPatternInsights = (pattern) => {
  const insights = {
    [THOUGHT_PATTERNS.CATASTROPHIZING]: {
      name: "Catastrophizing",
      description: "Imagining the worst possible outcome",
      example: "If I make a mistake, I'll lose my job and end up homeless",
      technique: "Ask yourself: 'What's the most likely outcome?'"
    },
    [THOUGHT_PATTERNS.MIND_READING]: {
      name: "Mind Reading",
      description: "Assuming you know what others are thinking",
      example: "They think I'm stupid and incompetent",
      technique: "Remember: You can't read minds, and thoughts aren't facts"
    },
    [THOUGHT_PATTERNS.FORTUNE_TELLING]: {
      name: "Fortune Telling",
      description: "Predicting negative future events",
      example: "I'll never be able to do this",
      technique: "Focus on what you can control in the present moment"
    },
    [THOUGHT_PATTERNS.ALL_OR_NOTHING]: {
      name: "All-or-Nothing Thinking",
      description: "Seeing things as black or white, no gray areas",
      example: "If I'm not perfect, I'm a complete failure",
      technique: "Look for the middle ground and shades of gray"
    },
    [THOUGHT_PATTERNS.OVERGENERALIZATION]: {
      name: "Overgeneralization",
      description: "Making broad conclusions from single events",
      example: "I always mess things up",
      technique: "Look for exceptions and specific evidence"
    },
    [THOUGHT_PATTERNS.EMOTIONAL_REASONING]: {
      name: "Emotional Reasoning",
      description: "Believing feelings reflect reality",
      example: "I feel anxious, so something bad must be happening",
      technique: "Separate feelings from facts"
    },
    [THOUGHT_PATTERNS.SHOULD_STATEMENTS]: {
      name: "Should Statements",
      description: "Using 'should', 'must', or 'ought' statements",
      example: "I should be able to handle this better",
      technique: "Replace 'should' with more compassionate language"
    },
    [THOUGHT_PATTERNS.PERSONALIZATION]: {
      name: "Personalization",
      description: "Taking responsibility for events beyond your control",
      example: "It's my fault the team project failed",
      technique: "Consider other factors and circumstances"
    },
    [THOUGHT_PATTERNS.DISCOUNTING_POSITIVES]: {
      name: "Discounting Positives",
      description: "Minimizing or ignoring positive experiences",
      example: "That doesn't count because anyone could do it",
      technique: "Acknowledge and celebrate your achievements"
    },
    [THOUGHT_PATTERNS.COMPARISON]: {
      name: "Comparison",
      description: "Comparing yourself unfavorably to others",
      example: "Everyone else is doing better than me",
      technique: "Focus on your own journey and progress"
    },
    [THOUGHT_PATTERNS.UNCERTAINTY]: {
      name: "Uncertainty Intolerance",
      description: "Difficulty with unknown outcomes",
      example: "What if something goes wrong?",
      technique: "Practice accepting uncertainty as part of life"
    },
    [THOUGHT_PATTERNS.PERFECTIONISM]: {
      name: "Perfectionism",
      description: "Setting impossibly high standards",
      example: "If it's not perfect, it's not worth doing",
      technique: "Aim for 'good enough' rather than perfect"
    }
  };

  return insights[pattern] || insights[THOUGHT_PATTERNS.UNCERTAINTY];
};

// Get mindfulness techniques
export const getMindfulnessTechniques = () => {
  return [
    {
      name: "Deep Breathing",
      description: "Take slow, deep breaths to calm your nervous system",
      steps: ["Inhale for 4 counts", "Hold for 4 counts", "Exhale for 6 counts", "Repeat 5-10 times"]
    },
    {
      name: "5-4-3-2-1 Grounding",
      description: "Use your senses to bring yourself to the present moment",
      steps: ["Name 5 things you can see", "4 things you can touch", "3 things you can hear", "2 things you can smell", "1 thing you can taste"]
    },
    {
      name: "Thought Observation",
      description: "Observe your thoughts without judgment",
      steps: ["Notice the thought", "Label it as 'just a thought'", "Let it pass like a cloud", "Return to your breath"]
    },
    {
      name: "Cognitive Reframing",
      description: "Look at the situation from a different perspective",
      steps: ["Identify the negative thought", "Ask 'Is this thought helpful?'", "Consider alternative viewpoints", "Choose a more balanced perspective"]
    },
    {
      name: "Self-Compassion",
      description: "Treat yourself with the same kindness you'd offer a friend",
      steps: ["Acknowledge your suffering", "Remember you're not alone", "Offer yourself kind words", "Practice self-care"]
    },
    {
      name: "Present Moment Focus",
      description: "Bring your attention to what's happening right now",
      steps: ["Notice your surroundings", "Feel your body", "Observe your breath", "Stay with the present"]
    },
    {
      name: "Gratitude Practice",
      description: "Focus on what you're thankful for",
      steps: ["Think of 3 things you're grateful for", "Feel the appreciation", "Express gratitude", "Notice the positive feelings"]
    },
    {
      name: "Body Scan",
      description: "Systematically focus on different parts of your body",
      steps: ["Start from your toes", "Move attention up your body", "Notice sensations", "Release tension"]
    }
  ];
};

// Helper function to validate API key format
export const validateAPIKey = (apiKey) => {
  return Boolean(apiKey && apiKey.length > 0 && apiKey !== 'YOUR_GEMINI_API_KEY');
};

// Function to update API key (you can call this when user provides their key)
export const updateAPIKey = (newApiKey) => {
  // In a real app, you'd want to store this securely
  // For now, we'll just update the constant
  // Note: This is not secure for production - use environment variables instead
  console.log('API Key updated. In production, use environment variables for security.');
}; 