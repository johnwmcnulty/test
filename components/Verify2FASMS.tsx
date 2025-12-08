import React, { useState, useEffect, useRef } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';

interface Verify2FASMSProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  onUpdatePhoneNumber: () => void;
  isLoading: boolean;
  error: string | null;
}

export const Verify2FASMS: React.FC<Verify2FASMSProps> = ({ onVerify, onBack, onUpdatePhoneNumber, isLoading, error }) => {
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(10); 
  const timerRef = useRef<number | null>(null);

  const startTimer = () => {
    setTimer(10);
    if(timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
        setTimer(prev => {
            if (prev <= 1) {
                if(timerRef.current) window.clearInterval(timerRef.current);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  }
  
  const handleSendCode = () => {
    setCodeSent(true);
    startTimer();
  }

  useEffect(() => {
    return () => {
        if(timerRef.current) window.clearInterval(timerRef.current);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };

  const formattedTime = `${Math.floor(timer / 60)}:${(timer % 60).toString().padStart(2, '0')}`;

  return (
    <Card>
      <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Verify via SMS</h2>
      {!codeSent ? (
        <>
            <p className="text-sm text-center text-gray-500 mb-6">We'll send a verification code to your registered mobile number ending in ••••1234.</p>
            <Button onClick={handleSendCode}>
                Get Code
            </Button>
            <p className="text-[10px] text-gray-400 mt-4 text-center">Standard message and data rates may apply.</p>
        </>
      ) : (
        <>
            <p className="text-sm text-center text-gray-500 mb-6">Enter the code sent to your mobile device. {timer > 0 && <span>It will expire in <span className="font-medium text-gray-700">{formattedTime}</span>.</span>}</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                id="2fa-sms-code"
                label="6-Digit SMS Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
                required
                autoFocus
                placeholder="demo code is 123456"
                disabled={timer === 0}
                error={error}
                />
                
                <Button type="submit" isLoading={isLoading} disabled={code.length !== 6 || timer === 0}>
                    Login
                </Button>
                
                <div className="text-center mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">Didn't receive a code?</p>
                    {timer === 0 ? (
                         <button 
                            type="button" 
                            onClick={handleSendCode} 
                            className="w-full flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                        >
                            <svg className="mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Resend Verification Code
                        </button>
                    ) : (
                        <div className="inline-flex items-center px-3 py-1 rounded bg-gray-50 border border-gray-200 text-gray-400 text-xs font-mono">
                            <svg className="mr-1.5 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Resend available in {formattedTime}
                        </div>
                    )}
                </div>
            </form>
        </>
      )}
       <div className="text-center mt-4 space-y-2">
            <div>
                <button type="button" onClick={onUpdatePhoneNumber} className="text-sm font-medium text-cyan-600 hover:text-cyan-700">
                    Need to update your phone number?
                </button>
            </div>
            <div>
                <button type="button" onClick={onBack} className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Back to Sign In
                </button>
            </div>
        </div>
    </Card>
  );
};