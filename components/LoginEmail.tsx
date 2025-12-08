import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface LoginEmailProps {
  onSubmit: (email: string) => void;
  onHelp: () => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginEmail: React.FC<LoginEmailProps> = ({ onSubmit, onHelp, isLoading, error }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };
  
  return (
    <Card>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
            <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sign In</h2>
        </div>
        <p className="text-sm text-gray-500 ml-4">
            Welcome back! Please enter your registered email address to access the secure portal.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-10">
            <Input
            id="email"
            label="Email Address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@cybcube.com"
            autoFocus
            error={error}
            />
        </div>
        
        <div className="flex justify-between items-center pt-2">
             <button 
                type="button"
                onClick={onHelp}
                className="flex items-center text-sm text-gray-500 hover:text-cyan-700 font-medium group transition-colors"
             >
                <span className="border-b border-transparent group-hover:border-cyan-700">Need Help?</span>
             </button>
             <div className="w-auto">
                <Button type="submit" isLoading={isLoading} fullWidth={false} variant="primary">
                    Proceed
                    <svg className="ml-2 -mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </Button>
             </div>
        </div>
      </form>
    </Card>
  );
};