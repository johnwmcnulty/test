import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface Verify2FAPinProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  onForgotPin: () => void;
  isLoading: boolean;
  error: string | null;
}

export const Verify2FAPin: React.FC<Verify2FAPinProps> = ({ onVerify, onBack, onForgotPin, isLoading, error }) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(pin);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Enter Security PIN</h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        This extra layer of security helps ensure it's really you. Please enter the 4-digit security PIN associated with your profile.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <Input
            id="2fa-pin-code"
            label="4-Digit PIN"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            maxLength={4}
            inputMode="numeric"
            pattern="[0-9]{4}"
            required
            autoFocus
            placeholder="demo PIN is 1234"
            error={error}
            />
            <div className="text-right mt-2">
                <button 
                    type="button" 
                    onClick={onForgotPin} 
                    className="text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:underline"
                >
                    Forgot PIN?
                </button>
            </div>
        </div>

        <Button type="submit" isLoading={isLoading} disabled={pin.length !== 4}>
          Login
        </Button>
        <div className="text-center text-sm">
            <button type="button" onClick={onBack} className="font-medium text-cyan-600 hover:text-cyan-700">
                Back to Sign In
            </button>
        </div>
      </form>
    </Card>
  );
};