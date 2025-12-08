
import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface TempPasswordExpiredProps {
  onBackToLogin: () => void;
  onResetPassword: () => void;
}

export const TempPasswordExpired: React.FC<TempPasswordExpiredProps> = ({ onBackToLogin, onResetPassword }) => {
  return (
    <Card>
      <div className="text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Temporary Password Expired</h2>
        <p className="mt-2 text-sm text-gray-500">
          The temporary password provided for this account has expired and is no longer valid.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          To regain access, please reset your password below. If this does not work, contact your organization's administrator for a new invitation.
        </p>
      </div>
      <div className="mt-6 space-y-3">
        <Button onClick={onResetPassword}>
          Reset Password
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
