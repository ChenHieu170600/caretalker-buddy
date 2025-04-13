import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { useChat } from '../utils/chatUtils';
import MessageBubble from './MessageBubble';
import ConversationsSidebar from './ConversationsSidebar';
import { Send, ChevronDown } from 'lucide-react';
import { 
  StoredConversation, 
  saveConversation, 
  loadConversation, 
  getAllConversations,
  deleteConversation,
  generateConversationId,
  initializeConversationsDirectory,
  conversationsDirectory
} from '../utils/conversationStorage';

const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    messages, 
    loading, 
    sendMessage, 
    messagesEndRef, 
    availableModels, 
    currentModel, 
    setModel,
    availablePersonas,
    currentPersona,
    setPersona,
    loadMessages,
    clearMessages
  } = useChat();
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isPersonaDropdownOpen, setIsPersonaDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const personaDropdownRef = useRef<HTMLDivElement>(null);

  // Initialize conversations directory and load conversations on mount
  useEffect(() => {
    const initializeStorage = async () => {
      try {
        setIsLoading(true);
        // Try to load conversations from localStorage first
        const loadedConversations = await getAllConversations();
        setConversations(loadedConversations);
        
        // If there are conversations, load the most recent one
        if (loadedConversations.length > 0) {
          const mostRecent = loadedConversations[0];
          setCurrentConversationId(mostRecent.id);
          const conversation = await loadConversation(mostRecent.id);
          if (conversation) {
            loadMessages(conversation.messages);
          }
        }
      } catch (error) {
        console.error('Failed to initialize conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeStorage();
  }, []);

  // Save conversation when messages change
  useEffect(() => {
    const saveCurrentConversation = async () => {
      if (messages.length > 0 && currentConversationId) {
        const conversation: StoredConversation = {
          id: currentConversationId,
          title: messages[0].content.slice(0, 30) + '...',
          messages: messages.map(msg => ({
            role: msg.sender,
            content: msg.content,
            timestamp: msg.timestamp.toISOString()
          })),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        await saveConversation(conversation);
        const updatedConversations = await getAllConversations();
        setConversations(updatedConversations);
      }
    };
    
    saveCurrentConversation();
  }, [messages, currentConversationId]);

  const handleNewConversation = async () => {
    // Try to initialize directory access when creating a new conversation
    if (!conversationsDirectory) {
      await initializeConversationsDirectory();
    }
    const newId = generateConversationId();
    setCurrentConversationId(newId);
    clearMessages();
  };

  const handleSelectConversation = async (id: string) => {
    setCurrentConversationId(id);
    const conversation = await loadConversation(id);
    if (conversation) {
      loadMessages(conversation.messages);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
    const updatedConversations = await getAllConversations();
    setConversations(updatedConversations);
    
    if (id === currentConversationId) {
      setCurrentConversationId(null);
      clearMessages();
    }
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (personaDropdownRef.current && !personaDropdownRef.current.contains(event.target as Node)) {
        setIsPersonaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
      
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleModelSelect = (model: string) => {
    setModel(model);
    setIsModelDropdownOpen(false);
  };

  const handlePersonaSelect = (persona: string) => {
    setPersona(persona);
    setIsPersonaDropdownOpen(false);
  };

  // Format model name for display
  const formatModelName = (model: string) => {
    // Extract the model name from the full model ID
    const parts = model.split('/');
    if (parts.length > 1) {
      return parts[1].split(':')[0];
    }
    return model;
  };

  return (
    <div className="flex h-screen">
      <ConversationsSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onNewConversation={handleNewConversation}
        isLoading={isLoading}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
          <div className="rounded-2xl glass-panel p-4 md:p-6 flex-grow flex flex-col h-full">
            {/* Controls Bar */}
            <div className="flex justify-between mb-2">
              {/* Model Selection Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-1 text-sm text-starry-text hover:text-starry-highlight transition-colors"
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                >
                  <span>Model: {formatModelName(currentModel)}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isModelDropdownOpen && (
                  <div className="absolute top-8 left-0 z-10 w-48 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-white/10">
                    <div className="py-1">
                      {availableModels.map((model) => (
                        <button
                          key={model}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            model === currentModel
                              ? 'bg-starry-highlight/20 text-starry-highlight'
                              : 'text-starry-text hover:bg-starry-highlight/10'
                          }`}
                          onClick={() => handleModelSelect(model)}
                        >
                          {formatModelName(model)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Persona Selection Dropdown */}
              <div className="relative" ref={personaDropdownRef}>
                <button
                  className="flex items-center space-x-1 text-sm text-starry-text hover:text-starry-highlight transition-colors"
                  onClick={() => setIsPersonaDropdownOpen(!isPersonaDropdownOpen)}
                >
                  <span>Persona: {currentPersona}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isPersonaDropdownOpen && (
                  <div className="absolute top-8 right-0 z-10 w-48 rounded-md shadow-lg bg-black/80 backdrop-blur-sm border border-white/10">
                    <div className="py-1">
                      {availablePersonas.map((persona) => (
                        <button
                          key={persona.id}
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            persona.id === currentPersona
                              ? 'bg-starry-highlight/20 text-starry-highlight'
                              : 'text-starry-text hover:bg-starry-highlight/10'
                          }`}
                          onClick={() => handlePersonaSelect(persona.id)}
                        >
                          {persona.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="chat-container flex-grow my-4 rounded-xl bg-black/20 overflow-y-auto backdrop-blur-sm">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-4 py-10 text-center">
                  <div className="w-16 h-16 mb-6 rounded-full glass-panel flex items-center justify-center animate-starshine">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-8 h-8 text-starry-highlight"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-starry-text text-glow">Welcome to MindfulCompanion</h3>
                  <p className="text-starry-muted max-w-md">
                    I'm here to listen and provide support when you need it. 
                    Share how you're feeling or what's on your mind.
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                  {loading && (
                    <div className="chat-bubble-bot animate-pulse-subtle py-3 px-4 inline-flex">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="relative">
              <textarea
                ref={inputRef}
                className="w-full rounded-xl border-none bg-black/30 px-4 py-3 text-starry-text focus:ring-2 focus:ring-starry-highlight focus:outline-none resize-none"
                rows={2}
                placeholder="Type your message here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="absolute right-3 bottom-3 p-2 rounded-full bg-starry-highlight text-white hover:bg-opacity-80 transition-colors duration-300"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || loading}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
