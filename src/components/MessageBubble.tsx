import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isUser
            ? 'bg-indigo-600 text-white'
            : 'bg-indigo-600 text-white'
        }`}
      >
        <div className="markdown-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({node, ...props}) => <p className="text-white" {...props} />,
              li: ({node, ...props}) => <li className="text-white" {...props} />,
              a: ({node, ...props}) => <a className="text-indigo-200" {...props} />,
              code: ({node, ...props}) => <code className="bg-indigo-700 text-white" {...props} />,
              h1: ({node, ...props}) => <h1 className="text-white" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-white" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-white" {...props} />,
              h4: ({node, ...props}) => <h4 className="text-white" {...props} />,
              h5: ({node, ...props}) => <h5 className="text-white" {...props} />,
              h6: ({node, ...props}) => <h6 className="text-white" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-indigo-400 text-white" {...props} />,
              ul: ({node, ...props}) => <ul className="text-white" {...props} />,
              ol: ({node, ...props}) => <ol className="text-white" {...props} />,
              table: ({node, ...props}) => <table className="text-white" {...props} />,
              th: ({node, ...props}) => <th className="text-white" {...props} />,
              td: ({node, ...props}) => <td className="text-white" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-indigo-700 text-white" {...props} />,
              em: ({node, ...props}) => <em className="text-white" {...props} />,
              strong: ({node, ...props}) => <strong className="text-white" {...props} />,
              del: ({node, ...props}) => <del className="text-white" {...props} />,
              hr: ({node, ...props}) => <hr className="border-indigo-400" {...props} />
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <div className="text-xs mt-1 text-indigo-100">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
