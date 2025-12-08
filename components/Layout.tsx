
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onSystemStatusClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, onSystemStatusClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900 relative selection:bg-cyan-100 selection:text-cyan-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#2d333b 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 pointer-events-none"></div>

      <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center w-full sticky top-0 z-10 border-b border-gray-200/50">
        <div className="h-full w-16 bg-[#2d333b] flex items-center justify-center shrink-0">
           {/* CyberCube Logo */}
           <div className="w-10 h-10">
              <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100" height="100" fill="#10b981" />
                  <rect x="35" y="35" width="30" height="30" fill="white" />
                  <rect x="65" y="48" width="35" height="4" fill="white" />
              </svg>
           </div>
        </div>
        <div className="pl-6 border-l border-transparent">
            <h1 className="text-xl text-gray-800 font-normal tracking-tight">CyberCube <span className="font-semibold text-gray-900">Login</span></h1>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10 relative">
        {children}
      </main>

      <footer className="w-full py-6 px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 bg-white/50 backdrop-blur-sm border-t border-gray-200/50 z-10 relative">
        <div className="w-full md:w-auto text-center md:text-left order-2 md:order-1 mt-2 md:mt-0">
          Copyright © 2025 CyberCube. All rights reserved.
        </div>
        <div className="w-full md:w-auto text-center md:text-right order-1 md:order-2">
            <button 
                onClick={onSystemStatusClick}
                className="text-cyan-700 font-medium hover:text-cyan-800 hover:underline transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
                CyberCube System Status
            </button>
        </div>
      </footer>
    </div>
  );
};
