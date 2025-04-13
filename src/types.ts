
export interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  id?: string;
  conversationId?: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastUpdated: Date;
  messages: Message[];
}
