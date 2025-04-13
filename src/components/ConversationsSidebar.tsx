
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { getConversations, createNewConversation, deleteConversation } from '../utils/apiService';
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface ConversationsSidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const result = await getConversations();
      if (result.conversations) {
        const convArray = Object.entries(result.conversations).map(([id, data]) => ({
          id,
          title: data.title || 'Untitled Conversation',
          updatedAt: data.updated_at,
        }));

        // Sort conversations by updated_at date (newest first)
        convArray.sort((a, b) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        setConversations(convArray);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      await createNewConversation();
      await loadConversations();
      onNewConversation();
    } catch (error) {
      console.error('Failed to create new conversation:', error);
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    try {
      await deleteConversation(conversationId);
      await loadConversations();
      if (conversationId === currentConversationId) {
        // If we deleted the current conversation, create a new one
        onNewConversation();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  // Load conversations initially and whenever the current conversation changes
  useEffect(() => {
    loadConversations();
  }, [currentConversationId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`conversation-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </div>
      
      <div className={`sidebar-content ${isOpen ? 'block' : 'hidden'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-starry-text">Conversations</h3>
          <button
            onClick={handleNewConversation}
            className="p-2 rounded-full bg-starry-highlight/20 hover:bg-starry-highlight/30 text-starry-highlight transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-starry-highlight"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-starry-muted text-center py-4 text-sm">
            No conversations yet
          </div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li 
                key={conversation.id}
                className={`
                  p-2 rounded-lg cursor-pointer flex justify-between items-center
                  ${currentConversationId === conversation.id 
                    ? 'bg-starry-highlight/20 text-starry-highlight' 
                    : 'text-starry-text hover:bg-white/5'}
                  transition-colors
                `}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{conversation.title}</p>
                  <p className="text-xs text-starry-muted">{formatDate(conversation.updatedAt)}</p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  className="p-1 rounded-full opacity-60 hover:opacity-100 hover:bg-white/5"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar;
