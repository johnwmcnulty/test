import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface Verify2FAAuthenticatorProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export const Verify2FAAuthenticator: React.FC<Verify2FAAuthenticatorProps> = ({ onVerify, onBack, isLoading, error }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Two-Factor Authentication</h2>
      <p className="text-sm text-center text-gray-500 mb-6">
        Please open your authenticator app (e.g., Google or Microsoft Authenticator) and enter the 6-digit code for your CyberCube account.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="2fa-verify-code"
          label="6-Digit Code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          maxLength={6}
          inputMode="numeric"
          pattern="[0-9]{6}"
          required
          autoFocus
          placeholder="123456"
          error={error}
        />
        
        <Button type="submit" isLoading={isLoading} disabled={code.length !== 6}>
          Verify
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