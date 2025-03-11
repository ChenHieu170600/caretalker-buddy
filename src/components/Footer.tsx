
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 mt-auto w-full animate-fade-in">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            MindfulCompanion is here to provide support, but is not a replacement for professional mental health care.
          </p>
          <div className="flex items-center space-x-4">
            <button className="text-xs py-1.5 px-3 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-300">
              Help
            </button>
            <button className="text-xs py-1.5 px-3 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-300">
              Resources
            </button>
            <button className="text-xs py-1.5 px-3 rounded-full bg-support text-white hover:bg-support-dark transition-colors duration-300">
              Crisis Help
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
