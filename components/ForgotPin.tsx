import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface ForgotPinProps {
    onBack: () => void;
    isLoading: boolean;
    onSubmit: (email: string) => void;
    initialEmail?: string;
}

export const ForgotPin: React.FC<ForgotPinProps> = ({ onBack, isLoading, onSubmit, initialEmail = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(email);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Card>
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Sent</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        If an account matches <span className="font-medium text-gray-900">{email}</span>, you will receive instructions via email on how to reset your security PIN.
                    </p>
                    <Button onClick={onBack}>Back to Verification</Button>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Reset Security PIN</h2>
            <p className="text-sm text-center text-gray-500 mb-6">
                To reset your security PIN, please confirm your email address below. We will send you a secure link to create a new PIN.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="forgot-pin-email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@cybcube.com"
                />
                <Button type="submit" isLoading={isLoading}>
                    Send Reset Instructions
                </Button>
                <div className="text-center">
                    <button type="button" onClick={onBack} className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                        Back to Verification
                    </button>
                </div>
            </form>
        </Card>
    );
};