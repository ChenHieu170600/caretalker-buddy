
export interface Message {
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  id?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
