import { useEffect, useState } from 'react';
import { PlusCircle, MessageSquare, Search, Trash2, Edit, ChevronLeft } from 'lucide-react';
import { Conversation } from '../types';
import { useChat } from '../utils/chatUtils';
import { deleteConversation } from '../utils/conversationUtils';

interface ConversationsSidebarProps {
  onClose?: () => void;
  isMobile?: boolean;
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({ 
  onClose, 
  isMobile = false 
}) => {
  const { 
    conversations, 
    activeConversationId, 
    selectConversation, 
    createNewConversation 
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(conversations);

  // Filter conversations when search term or conversations change
  useEffect(() => {
    if (searchTerm) {
      const filtered = conversations.filter(convo => 
        convo.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchTerm, conversations]);

  const handleNewConversation = () => {
    createNewConversation();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
      if (id === activeConversationId) {
        selectConversation(null);
      }
      // Force refresh the conversation list
      useChat().conversations;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const conversationDate = new Date(date);
    
    // If today, show time only
    if (now.toDateString() === conversationDate.toDateString()) {
      return conversationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If this year, show date without year
    if (now.getFullYear() === conversationDate.getFullYear()) {
      return conversationDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show full date
    return conversationDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full bg-black/30 backdrop-blur-md text-starry-text border-r border-white/10">
      {isMobile && (
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
      
      <div className="p-3">
        <button
          onClick={handleNewConversation}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md border border-white/20 hover:bg-white/10 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Conversation</span>
        </button>
      </div>
      
      <div className="px-3 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-starry-muted" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/5 rounded-md focus:outline-none focus:ring-1 focus:ring-starry-highlight text-sm"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-3">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-starry-muted">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map(conversation => (
              <div
                key={conversation.id}
                className={`flex items-start justify-between p-2 rounded-md cursor-pointer transition-colors ${
                  activeConversationId === conversation.id
                    ? 'bg-starry-highlight/20 text-starry-highlight'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div className="flex items-start gap-3 overflow-hidden">
                  <MessageSquare className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                    <p className="text-xs text-starry-muted truncate">
                      {formatDate(conversation.updatedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 hover:opacity-100">
                  <button
                    className="p-1 rounded-md hover:bg-white/10"
                    onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar;
