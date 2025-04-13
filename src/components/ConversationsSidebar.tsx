// Update the import path for useToast
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import { Conversation } from '../types';
import { createNewConversation, getConversations, deleteConversation } from '../utils/apiService';
import { cn } from "@/lib/utils";

interface ConversationsSidebarProps {
    onConversationSelected: (conversationId: string) => void;
    selectedConversationId: string | null;
    onClose: () => void;
}

const ConversationsSidebar: React.FC<ConversationsSidebarProps> = ({ onConversationSelected, selectedConversationId, onClose }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            const fetchedConversations = await getConversations();
            setConversations(fetchedConversations);
        } catch (error) {
            console.error("Failed to load conversations:", error);
            toast({
                title: "Error loading conversations",
                description: "Failed to load your conversations. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleCreateConversation = async () => {
        setIsCreating(true);
        try {
            const newConversation = await createNewConversation();
            setConversations(prev => [...prev, newConversation]);
            onConversationSelected(newConversation.id);
            toast({
                title: "Conversation created",
                description: "New conversation has been successfully created.",
            });
        } catch (error) {
            console.error("Failed to create conversation:", error);
            toast({
                title: "Error creating conversation",
                description: "Failed to create a new conversation. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteConversation = async (conversationId: string) => {
        try {
            await deleteConversation(conversationId);
            setConversations(prev => prev.filter(c => c.id !== conversationId));
            if (selectedConversationId === conversationId) {
                onConversationSelected(conversations[0]?.id || null);
            }
            toast({
                title: "Conversation deleted",
                description: "The conversation has been successfully deleted.",
            });
        } catch (error) {
            console.error("Failed to delete conversation:", error);
            toast({
                title: "Error deleting conversation",
                description: "Failed to delete the conversation. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="conversation-sidebar">
            <div className="sidebar-content">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-starry-text">Conversations</h2>
                    <button
                        onClick={handleCreateConversation}
                        disabled={isCreating}
                        className="px-3 py-1 bg-starry-highlight hover:bg-purple-700 text-white rounded-md transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
                    >
                        <Plus className="h-4 w-4 mr-2 inline-block" />
                        New
                    </button>
                </div>
                <ul>
                    {conversations.map(conversation => (
                        <li
                            key={conversation.id}
                            className={`py-2 px-4 rounded-md cursor-pointer hover:bg-white/5 transition-colors ${selectedConversationId === conversation.id ? 'bg-white/10' : ''}`}
                            onClick={() => onConversationSelected(conversation.id)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-starry-text">{conversation.title}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteConversation(conversation.id);
                                    }}
                                    className="text-white/50 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar-toggle" onClick={onClose}>
                &times;
            </div>
        </div>
    );
};

export default ConversationsSidebar;
