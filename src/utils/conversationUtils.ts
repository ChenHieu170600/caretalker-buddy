
import { v4 as uuidv4 } from 'uuid';
import { Conversation, Message } from '../types';

// Function to create a new conversation
export const createConversation = (initialMessage?: string): Conversation => {
  const timestamp = new Date();
  const id = `convo_${timestamp.toISOString().replace(/:/g, '-').replace(/\./g, '-')}`;
  
  const conversation: Conversation = {
    id,
    title: initialMessage ? initialMessage.substring(0, 30) + (initialMessage.length > 30 ? '...' : '') : 'New Conversation',
    messages: initialMessage ? [{
      id: uuidv4(),
      content: initialMessage,
      sender: 'user',
      timestamp: timestamp
    }] : [],
    createdAt: timestamp,
    updatedAt: timestamp
  };
  
  // Save to local storage
  saveConversation(conversation);
  
  return conversation;
};

// Function to save conversation to localStorage (simulating file system)
export const saveConversation = (conversation: Conversation): void => {
  const conversationsString = localStorage.getItem('conversations');
  let conversations: Record<string, Conversation> = {};
  
  if (conversationsString) {
    conversations = JSON.parse(conversationsString);
  }
  
  conversations[conversation.id] = conversation;
  localStorage.setItem('conversations', JSON.stringify(conversations));
};

// Function to add a message to a conversation
export const addMessageToConversation = (
  conversationId: string, 
  content: string, 
  sender: 'user' | 'bot'
): Message | null => {
  const conversationsString = localStorage.getItem('conversations');
  if (!conversationsString) return null;
  
  const conversations: Record<string, Conversation> = JSON.parse(conversationsString);
  const conversation = conversations[conversationId];
  
  if (!conversation) return null;
  
  const message: Message = {
    id: uuidv4(),
    content,
    sender,
    timestamp: new Date()
  };
  
  conversation.messages.push(message);
  conversation.updatedAt = new Date();
  
  // Update title for the first user message if it doesn't have a custom title
  if (sender === 'user' && conversation.messages.filter(m => m.sender === 'user').length === 1) {
    conversation.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
  }
  
  saveConversation(conversation);
  return message;
};

// Function to get all conversations
export const getConversations = (): Conversation[] => {
  const conversationsString = localStorage.getItem('conversations');
  if (!conversationsString) return [];
  
  const conversations: Record<string, Conversation> = JSON.parse(conversationsString);
  
  // Convert to array and sort by updated date (newest first)
  return Object.values(conversations).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
};

// Function to get a specific conversation
export const getConversation = (id: string): Conversation | null => {
  const conversationsString = localStorage.getItem('conversations');
  if (!conversationsString) return null;
  
  const conversations: Record<string, Conversation> = JSON.parse(conversationsString);
  return conversations[id] || null;
};

// Function to delete a conversation
export const deleteConversation = (id: string): boolean => {
  const conversationsString = localStorage.getItem('conversations');
  if (!conversationsString) return false;
  
  const conversations: Record<string, Conversation> = JSON.parse(conversationsString);
  
  if (!conversations[id]) return false;
  
  delete conversations[id];
  localStorage.setItem('conversations', JSON.stringify(conversations));
  return true;
};
