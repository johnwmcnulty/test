import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-2xl shadow-gray-200/50 p-8 w-full max-w-[440px] mx-auto border-t-4 border-t-cyan-500 relative">
      {children}
    </div>
  );
};