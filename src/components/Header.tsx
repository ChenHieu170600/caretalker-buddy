
import React from 'react';
import { MessageCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="py-6 animate-fade-in w-full">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full glass-panel flex items-center justify-center animate-float-slow">
              <MessageCircle className="w-5 h-5 text-starry-highlight" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-starry-text text-glow">
                Mindful<span className="text-starry-highlight">Companion</span>
              </h1>
              <p className="text-xs text-starry-muted">Your private AI support space</p>
            </div>
          </div>
          <div>
            <button className="text-sm py-2 px-4 rounded-full glass-panel text-starry-text hover:bg-opacity-50 transition-colors duration-300">
              About
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
