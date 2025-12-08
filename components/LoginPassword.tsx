import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface LoginPasswordProps {
  onSubmit: (pass: string) => void;
  onForgotPassword: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
  email: string;
}

export const LoginPassword: React.FC<LoginPasswordProps> = ({ onSubmit, onForgotPassword, onBack, isLoading, error, email }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };
  
  return (
    <Card>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Password</h2>
        <p className="text-sm text-gray-500 truncate mb-1">{email}</p>
        <p className="text-xs text-gray-400 mb-2">Please enter your password to confirm your identity.</p>
        <button onClick={onBack} className="text-xs text-cyan-600 hover:text-cyan-700 underline">Not you? Sign in with a different account</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <Input
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="demo password is 1234"
            autoFocus
            error={error}
            endIcon={
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            }
            />
            <div className="flex justify-between items-start mt-2">
                <p className="text-[10px] text-gray-400">Passwords are case-sensitive.</p>
                <button 
                    type="button" 
                    onClick={onForgotPassword} 
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                    Forgot Password?
                </button>
            </div>
        </div>

        <Button type="submit" isLoading={isLoading}>
          Proceed
        </Button>
      </form>
    </Card>
  );
};