
import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface UpdatePhoneNumberProps {
    onBack: () => void;
    isLoading: boolean;
    onSubmit: (email: string) => void;
    initialEmail?: string;
}

export const UpdatePhoneNumber: React.FC<UpdatePhoneNumberProps> = ({ onBack, isLoading, onSubmit, initialEmail = '' }) => {
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
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Request Sent</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        We have sent instructions to <span className="font-medium text-gray-900">{email}</span> on how to securely update your registered phone number.
                    </p>
                    <Button onClick={onBack}>Back to Verification</Button>
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Update Phone Number</h2>
            <p className="text-sm text-center text-gray-500 mb-6">
                No longer have access to your device ending in ••••1234? <br/>
                Enter your email address to request a phone number update.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    id="update-phone-email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="user@cybcube.com"
                />
                <Button type="submit" isLoading={isLoading}>
                    Send Update Request
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
