// AI Service for Mindfulness App
// This provides fallback responses when no API key is configured

export const getAIFeedback = async (thought) => {
  // Fallback responses when API key is not configured
  const fallbackResponses = [
    "This thought seems to be based on uncertainty. Try to focus on what you can control and let go of what you can't.",
    "Consider reframing this thought. Instead of 'what if', try 'what is' and focus on the present moment.",
    "This appears to be a pattern of overthinking. Take a step back and ask yourself: 'Is this thought helpful right now?'",
    "Remember that thoughts are not facts. You have the power to choose which thoughts to engage with.",
    "This thought might be coming from a place of fear. Practice self-compassion and remind yourself that you're doing your best.",
    "Try the 5-4-3-2-1 grounding technique: Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    "This thought pattern might benefit from some distance. Ask yourself: 'Will this matter in a week, a month, or a year?'",
    "Consider if this thought is serving your well-being. If not, gently redirect your attention to your breath or a positive memory.",
    "This thought seems to be creating unnecessary stress. Try to observe it without judgment, like watching clouds pass by.",
    "Remember that you are not your thoughts. You are the observer of your thoughts, and you can choose which ones to follow."
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  return {
    success: true,
    message: randomResponse
  };
}; 