// Update the import path for useToast
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation } from '../types';
import { sendMessageToBackend, fetchConversations, createNewConversation } from './apiService';
import { useToast } from "../hooks/use-toast";

interface ChatHookProps {
    conversationId: string | null;
    onConversationChange: (conversationId: string) => void;
}

export const useChat = ({ conversationId, onConversationChange }: ChatHookProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { toast } = useToast();

    // Load messages for the current conversation
    useEffect(() => {
        if (conversationId) {
            setLoading(true);
            fetchConversations()
                .then(conversations => {
                    const conversation = conversations.find(c => c.id === conversationId);
                    if (conversation) {
                        setMessages(conversation.messages);
                    } else {
                        setMessages([]);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    setError('Failed to load messages.');
                    setLoading(false);
                    console.error("Error fetching conversations:", err);
                });
        } else {
            setMessages([]);
        }
    }, [conversationId]);

    // Function to send a new message
    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const tempMessage: Message = {
            id: uuidv4(),
            conversationId: conversationId || 'temp',
            content: newMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prevMessages => [...prevMessages, tempMessage]);
        setNewMessage('');
        setIsTyping(true);

        try {
            if (conversationId) {
                const response = await sendMessageToBackend(conversationId, newMessage);
                if (response && response.content) {
                    const botMessage: Message = {
                        id: uuidv4(),
                        conversationId: conversationId,
                        content: response.content,
                        sender: 'bot',
                        timestamp: new Date(),
                    };
                    setMessages(prevMessages => [...prevMessages, botMessage]);
                } else {
                    throw new Error('Failed to send message.');
                }
            } else {
                const newConversation = await createNewConversation(newMessage);
                if (newConversation && newConversation.id) {
                    onConversationChange(newConversation.id);
                    toast({
                        title: "New Conversation Started!",
                        description: "Your conversation has been successfully created.",
                    });
                } else {
                    throw new Error('Failed to create new conversation.');
                }
            }
        } catch (err) {
            setError('Failed to send message.');
            console.error("Error sending message:", err);
            toast({
                title: "Message Failed",
                description: "There was an error sending your message. Please try again.",
            });
            setMessages(prevMessages => prevMessages.filter(message => message.id !== tempMessage.id));
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    return {
        messages,
        loading,
        error,
        newMessage,
        setNewMessage,
        sendMessage,
        isTyping,
        handleKeyDown
    };
};
