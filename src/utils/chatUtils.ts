
import { useState, useEffect, useRef } from 'react';
import { sendMessageToBackend } from './apiService';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Sample fallback responses for different support categories (used if API is unavailable)
const fallbackResponses = {
  anxiety: [
    "I understand anxiety can be overwhelming. Take a deep breath - inhale for 4 counts, hold for 4, and exhale for 6.",
    "When you're feeling anxious, try grounding yourself by naming 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    "It's okay to step away from situations that trigger your anxiety. Your well-being is the priority.",
    "Remember that anxious thoughts are not facts - they're just thoughts, and they will pass.",
  ],
  depression: [
    "Depression can make even small tasks feel overwhelming. Remember that getting out of bed today was an achievement.",
    "Try to set one small, achievable goal for today. Even something as simple as drinking a glass of water counts as progress.",
    "Your feelings are valid, and it's okay to not be okay sometimes. I'm here to listen whenever you need support.",
    "Consider gentle movement like a short walk or simple stretches - physical activity, even brief, can help shift your mood.",
  ],
  stress: [
    "Let's try a quick relaxation technique: tense all your muscles for 5 seconds, then release completely. Notice how different your body feels afterward.",
    "Are you taking short, shallow breaths? Try breathing from your diaphragm - place a hand on your stomach and make it rise with each inhale.",
    "What's one small thing you could do right now to be kind to yourself? Perhaps a warm drink or a moment of stillness?",
    "Remember that it's okay to set boundaries and say no to additional responsibilities when you're feeling overwhelmed.",
  ],
  general: [
    "How are you feeling right now, on a scale from 1-10?",
    "Remember that your worth isn't determined by your productivity or achievements. You matter simply because you exist.",
    "What's one tiny thing that brought you joy recently? Sometimes focusing on small pleasures can help shift our perspective.",
    "You're not alone in your struggles, even when it feels that way. Many people face similar challenges, and reaching out like this is a brave step.",
  ],
};

// Function to get a fallback response if the API fails
export const getFallbackResponse = (category: keyof typeof fallbackResponses | string): string => {
  const categoryKey = category in fallbackResponses ? category as keyof typeof fallbackResponses : 'general';
  const categoryResponses = fallbackResponses[categoryKey];
  const randomIndex = Math.floor(Math.random() * categoryResponses.length);
  return categoryResponses[randomIndex];
};

// Custom hook for managing chat messages
export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (content: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const sendMessage = async (content: string, category: string = 'general') => {
    if (!content.trim()) return;
    
    addMessage(content, 'user');
    setLoading(true);
    
    try {
      // Send message to the Python backend
      const response = await sendMessageToBackend(content, category);
      
      // Add the response from the backend to the chat
      addMessage(response.message, 'bot');
    } catch (error) {
      console.error('Error getting response:', error);
      // If there's an error with the API, use fallback responses
      const fallbackResponse = getFallbackResponse(category);
      addMessage(fallbackResponse, 'bot');
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    messages,
    loading,
    sendMessage,
    messagesEndRef,
  };
};
