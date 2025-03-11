
import React from 'react';
import { Message } from '../utils/chatUtils';
import { cn } from '../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formattedTime = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'animate-fade-in-up max-w-[80%] mb-4',
        message.sender === 'user' ? 'ml-auto' : 'mr-auto'
      )}
    >
      <div
        className={cn(
          'rounded-2xl p-4',
          message.sender === 'user'
            ? 'chat-bubble-user'
            : 'chat-bubble-bot'
        )}
      >
        <p className="text-base leading-relaxed">{message.content}</p>
      </div>
      <div
        className={cn(
          'text-xs mt-1 text-starry-muted',
          message.sender === 'user' ? 'text-right' : 'text-left'
        )}
      >
        {formattedTime}
      </div>
    </div>
  );
};

export default MessageBubble;
