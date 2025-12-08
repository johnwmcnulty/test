import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface ForgotPasswordProps {
  onResetRequest: (email: string) => Promise<{ isNewUser: boolean }>;
  onBackToLogin: () => void;
  onProceedToReset: () => void;
  isLoading: boolean;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onResetRequest, onBackToLogin, onProceedToReset, isLoading }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isNewUser } = await onResetRequest(email);
    setIsNewUser(isNewUser);
    setSubmitted(true);
  };

  if (submitted) {
    return (
        <Card>
            {isNewUser ? (
                 <>
                    <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">Temporary Password</h2>
                    <p className="text-sm text-center text-gray-500 mb-6">
                        Your account was recently created and uses a temporary password. If you've lost it, please contact your organization's administrator to request a new invitation email.
                    </p>
                    <Button onClick={onBackToLogin}>
                        Back to Sign In
                    </Button>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">Check your email</h2>
                    <p className="text-sm text-center text-gray-500 mb-6">
                        If an account with <span className="font-medium text-gray-700">{email}</span> exists, you will receive an email with instructions on how to reset your password.
                        <br/><br/>
                        Please check your spam or junk folder if you don't see the email within a few minutes.
                    </p>
                    <div className="my-4 text-center p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
                        <p className="text-sm text-gray-500 mb-3">For demo purposes, click below to simulate following the reset link from the email.</p>
                        <button 
                            type="button" 
                            onClick={onProceedToReset} 
                            className="font-medium text-cyan-600 hover:text-cyan-700"
                        >
                            Proceed to Reset Password
                        </button>
                    </div>
                    <Button onClick={onBackToLogin}>
                        Back to Sign In
                    </Button>
                </>
            )}
        </Card>
    )
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Forgot Password</h2>
      <p className="text-sm text-center text-gray-500 mb-6">Enter the email address associated with your account. We will send you a secure link to reset your password.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email-forgot"
          label="Email Address"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@cybcube.com"
        />
        <Button type="submit" isLoading={isLoading}>
          Send Reset Link
        </Button>
        <div className="text-center">
          <button type="button" onClick={onBackToLogin} className="font-medium text-sm text-cyan-600 hover:text-cyan-700">
            Back to Sign In
          </button>
        </div>
      </form>
    </Card>
  );
};