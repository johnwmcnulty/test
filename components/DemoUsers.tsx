import React, { useState } from 'react';
import { WelcomeEmailPreview } from './WelcomeEmailPreview';

interface DemoUsersProps {
    onSelect: (email: string) => void;
    onReset: () => void;
}

const DEMO_ACCOUNTS = [
    { email: 'user@cybcube.com', pass: '1234', title: 'Regular User (PIN 2FA)', desc: 'Main flow: Email -> Password -> PIN.' },
    { email: 'pin-user@cybcube.com', pass: '1234', title: 'Regular User (PIN 2FA)', desc: 'Returning user with PIN verification.' },
    { email: 'sms-user@cybcube.com', pass: '1234', title: 'Regular User (SMS 2FA)', desc: 'Returning user with SMS verification.' },
    { email: 'new@cybcube.com', pass: '1234', title: 'New User (First Time Login)', desc: 'Onboarding flow for new accounts.' },
    { email: 'expired@cybcube.com', pass: '1234', title: 'New User (Expired)', desc: 'Tests expired temporary password.' },
    { email: 'locked@cybcube.com', pass: '1234', title: 'Locked Account', desc: 'Tests account lock-out.' },
];

const WelcomeEmailModal: React.FC<{onClose: () => void; onReset: () => void}> = ({onClose, onReset}) => {
    return (
        <div 
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white rounded-lg max-w-2xl w-full border border-gray-200 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Sample Welcome Email</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none" aria-label="Close">&times;</button>
                </div>
                <div className="p-1 sm:p-2 md:p-4 max-h-[80vh] overflow-y-auto">
                    <WelcomeEmailPreview 
                        email="new.user@cybcube.com" 
                        isEmbedded={false} 
                        onReset={() => {
                            onReset();
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const DemoUsers: React.FC<DemoUsersProps> = ({ onSelect, onReset }) => {
    const [showEmail, setShowEmail] = useState(false);

    return (
        <>
            {showEmail && <WelcomeEmailModal onClose={() => setShowEmail(false)} onReset={onReset} />}
            
            <div className="border-t border-gray-200 pt-6 mt-8">
                <h3 className="text-center text-sm font-medium text-gray-500 mb-4">For Demo Purposes</h3>
                
                <div className="mb-4">
                    <button
                        onClick={onReset}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-sm text-sm"
                    >
                        Reset App State
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {DEMO_ACCOUNTS.map(acc => (
                        <button
                            key={acc.email}
                            type="button"
                            onClick={() => onSelect(acc.email)}
                            className="w-full h-full text-left p-3 rounded-md bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-500 shadow-sm flex flex-col"
                        >
                            <p className="font-semibold text-gray-900 text-sm">{acc.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{acc.desc}</p>
                        </button>
                    ))}
                     <button
                        type="button"
                        onClick={() => setShowEmail(true)}
                        className="w-full h-full text-left p-3 rounded-md bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-cyan-500 shadow-sm col-span-2 flex flex-col"
                    >
                        <p className="font-semibold text-gray-900 text-sm">View Sample Welcome Email</p>
                        <p className="text-xs text-gray-500 mt-1">See the email new users receive.</p>
                    </button>
                </div>
            </div>
        </>
    );
};
