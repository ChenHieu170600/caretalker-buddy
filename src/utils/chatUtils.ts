
import { useState, useEffect, useRef } from 'react';
import { sendMessageToBackend } from './apiService';

export type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

// Fallback responses in case the API is unavailable
const fallbackResponses = [
  "I'm here to listen and support you. How are you feeling today?",
  "That sounds challenging. Would you like to tell me more about what's going on?",
  "Thank you for sharing that with me. What do you think might help in this situation?",
  "It's normal to feel that way. Remember that your feelings are valid.",
  "I'm sorry to hear you're going through this. Remember to be kind to yourself.",
  "Would it help to try a quick breathing exercise together? We could take a few deep breaths.",
  "Is there someone in your life who might be able to offer additional support right now?",
];

// Function to get a fallback response if the API fails
export const getFallbackResponse = (): string => {
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
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
      const fallbackResponse = getFallbackResponse();
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
