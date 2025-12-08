import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface AccountLockedProps {
  onBackToLogin: () => void;
  onResetPassword: () => void;
}

export const AccountLocked: React.FC<AccountLockedProps> = ({ onBackToLogin, onResetPassword }) => {
  return (
    <Card>
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Account Locked</h2>
        <p className="mt-2 text-sm text-gray-500">
          For your security, your account has been temporarily locked due to multiple failed login attempts.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          You can try unlocking your account by resetting your password, or contact your organization's administrator.
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <Button onClick={onResetPassword}>
          Unlock via Password Reset
        </Button>
        <button 
            type="button" 
            onClick={onBackToLogin}
            className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          Back to Sign In
        </button>
      </div>
    </Card>
  );
};