
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 animate-fade-in w-full">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-support to-support-dark flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-medium">
                <span className="text-gradient">Mindful</span>Companion
              </h1>
              <p className="text-xs text-muted-foreground">Your supportive AI friend</p>
            </div>
          </div>
          <div>
            <button className="text-sm py-2 px-4 rounded-full bg-calm hover:bg-calm-dark transition-colors duration-300">
              About
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
