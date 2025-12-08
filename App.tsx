
import React, { useState, useCallback, useEffect } from 'react';
import { View, User, TwoFactorMethod } from './types';
import { Layout } from './components/Layout';
import { LoginEmail } from './components/LoginEmail';
import { LoginPassword } from './components/LoginPassword';
import { FirstTimeLogin } from './components/FirstTimeLogin';
import { Setup2FA } from './components/Setup2FA';
import { Verify2FAAuthenticator } from './components/Verify2FAAuthenticator';
import { Verify2FAPin } from './components/Verify2FAPin';
import { Verify2FASMS } from './components/Verify2FASMS';
import { ForgotPassword } from './components/ForgotPassword';
import { ForgotPin } from './components/ForgotPin';
import { UpdatePhoneNumber } from './components/UpdatePhoneNumber';
import { AccountLocked } from './components/AccountLocked';
import { TempPasswordExpired } from './components/TempPasswordExpired';
import { Dashboard } from './components/Dashboard';
import { ResetPassword } from './components/ResetPassword';
import { ResetPasswordSuccess } from './components/ResetPasswordSuccess';
import { DemoUsers } from './components/DemoUsers';
import { Help } from './components/Help';
import { Redirecting } from './components/Redirecting';
import { SystemStatus } from './components/SystemStatus';

// Mock users database
const USERS: Record<string, User> = {
    // UPDATED: Main user now uses PIN to match the requested flow
    'user@cybcube.com': { password: '1234', has2FA: true, twoFactorMethod: TwoFactorMethod.Pin }, 
    'pin-user@cybcube.com': { password: '1234', has2FA: true, twoFactorMethod: TwoFactorMethod.Pin },
    'sms-user@cybcube.com': { password: '1234', has2FA: true, twoFactorMethod: TwoFactorMethod.SMS },
    'new@cybcube.com': { 
        password: '1234', 
        has2FA: false, 
        isNew: true,
        tempPasswordExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
    },
    'locked@cybcube.com': { password: '1234', has2FA: true, isLocked: true },
    'expired@cybcube.com': {
        password: '1234',
        has2FA: false,
        isNew: true,
        tempPasswordExpiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Expired yesterday
    }
};

const MAX_LOGIN_ATTEMPTS = 5;
const VALID_2FA_CODE = "123456";
const VALID_PIN = "1234";
const VALID_SMS_CODE = "123456";

export default function App() {
    const [view, setView] = useState<View>(View.LoginEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [userForLogin, setUserForLogin] = useState<string | null>(null);
    const [userForRecovery, setUserForRecovery] = useState<string | null>(null);

    const resetState = useCallback(() => {
        setView(View.LoginEmail);
        setIsLoading(false);
        setError(null);
        setLoginAttempts(0);
        setUserForLogin(null);
        setUserForRecovery(null);
    }, []);

    const simulateApiCall = (duration = 1000) => {
        setIsLoading(true);
        setError(null);
        return new Promise(resolve => setTimeout(() => {
            setIsLoading(false);
            resolve(true);
        }, duration));
    };

    // Auto-redirect effect
    useEffect(() => {
        if (view === View.Redirecting) {
            const timer = setTimeout(() => {
                setView(View.Dashboard);
            }, 2500); 
            return () => clearTimeout(timer);
        }
    }, [view]);

    // Handler for Main Login Card - Now follows standard flow: Email -> Password -> 2FA
    const handleEmailSubmit = async (email: string) => {
        // Validation: Ensure valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address (e.g., user@company.com).");
            return;
        }

        await simulateApiCall(500);

        setUserForLogin(email);
        
        // Navigate to Password step
        setView(View.LoginPassword);
    }

    // Handler for Demo Buttons - Preserves Standard Flow
    const handleDemoLogin = async (email: string) => {
        await simulateApiCall(500);
        // Standard flow for demo users: Go to password screen
        setUserForLogin(email);
        setView(View.LoginPassword);
    }

    const handlePasswordSubmit = async (pass: string) => {
        await simulateApiCall();

        if (!userForLogin) return; // Should not happen

        const user = USERS[userForLogin];

        // Check if account is already locked
        if (user && user.isLocked) {
             setView(View.AccountLocked);
             return;
        }

        // Check login attempts
        if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
            setView(View.AccountLocked);
            return;
        }
        
        if (!user || user.password !== pass) {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);

            // Check if max attempts reached
            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                if (user) {
                    // Lock the user in the mock DB
                    user.isLocked = true;
                }
                setView(View.AccountLocked);
                return;
            }

            const attemptsLeft = MAX_LOGIN_ATTEMPTS - newAttempts;
            
            // Specific error message for password screen
            let errorMessage = "Incorrect password. Please try again.";
            
            // Provide specific warning if user is running out of attempts (last 3 attempts)
            if (attemptsLeft <= 3) {
                errorMessage = `Incorrect password. Warning: You have ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining before your account is locked.`;
            }
            
            setError(errorMessage);
            return;
        }
        
        if (user.isNew && user.tempPasswordExpiresAt && user.tempPasswordExpiresAt < new Date()) {
            setView(View.TempPasswordExpired);
            return;
        }
        
        setLoginAttempts(0);

        if (user.isNew) {
            setView(View.FirstTimeLogin);
        } else if (user.has2FA) {
            switch(user.twoFactorMethod) {
                case TwoFactorMethod.Pin:
                    setView(View.Verify2FAPin);
                    break;
                case TwoFactorMethod.SMS:
                    setView(View.Verify2FASMS);
                    break;
                case TwoFactorMethod.Authenticator:
                    setView(View.Verify2FAAuthenticator);
                    break;
                default:
                    setView(View.Verify2FAAuthenticator); // Fallback
            }
        } else {
            // No 2FA configured (unlikely for this demo but fallback)
            setView(View.Dashboard);
        }
    };
    
    const handleFirstTimeSubmit = async (password: string) => {
        await simulateApiCall();
        if (userForLogin) {
          USERS[userForLogin].password = password;
        }
        console.log(`New password set for ${userForLogin}: ${password}`);
        setView(View.Setup2FA);
    };

    const handle2FASetupComplete = async () => {
        await simulateApiCall(500);
        if (userForLogin) {
            const userToUpdate = USERS[userForLogin];
            if (userToUpdate) {
                userToUpdate.has2FA = true;
                userToUpdate.isNew = false;
                userToUpdate.twoFactorMethod = TwoFactorMethod.Authenticator;
                delete userToUpdate.tempPasswordExpiresAt;
            }
        }
        setView(View.Dashboard);
    };

    const handle2FAVerify = async (code: string, method: TwoFactorMethod) => {
        await simulateApiCall();
        let isValid = false;
        switch(method) {
            case TwoFactorMethod.Authenticator:
                isValid = code === VALID_2FA_CODE;
                break;
            case TwoFactorMethod.Pin:
                isValid = code === VALID_PIN;
                break;
            case TwoFactorMethod.SMS:
                isValid = code === VALID_SMS_CODE;
                break;
        }

        if (isValid) {
            // Instead of dashboard, go to Redirecting view
            setView(View.Redirecting);
        } else {
            let errorMsg = "The verification code is incorrect.";
            if (method === TwoFactorMethod.Pin) {
                errorMsg = "Incorrect PIN. Please double-check your 4-digit security PIN.";
            } else if (method === TwoFactorMethod.SMS) {
                errorMsg = "Incorrect SMS code. Please check the code sent to your mobile device.";
            } else {
                errorMsg = "Invalid authentication code. Please check your authenticator app and try again.";
            }
            setError(errorMsg);
        }
    };
    
    const handleForgotPasswordRequest = async (email: string) => {
        await simulateApiCall();
        const user = USERS[email];
        if (user && !user.isNew) {
            setUserForRecovery(email);
        }
        return { isNewUser: !!(user && user.isNew) };
    };

    const handleForgotPinRequest = async (email: string) => {
        await simulateApiCall();
        console.log(`PIN reset requested for ${email}`);
    }

    const handleUpdatePhoneNumberRequest = async (email: string) => {
        await simulateApiCall();
        console.log(`Phone number update requested for ${email}`);
    }

    const handlePasswordReset = async (password: string) => {
        await simulateApiCall();
        if (userForRecovery && USERS[userForRecovery]) {
            USERS[userForRecovery].password = password;
            USERS[userForRecovery].isLocked = false; 
            console.log(`Password has been reset for ${userForRecovery}`);
            setView(View.ResetPasswordSuccess);
        } else {
            setError("An error occurred during password reset. Please try again.");
            setView(View.LoginEmail);
        }
    };

    const handleProceedToReset = () => {
        if (userForRecovery) {
            setView(View.ResetPassword);
        } else {
            setView(View.LoginEmail);
        }
    };
    
    const handleBackToEmail = () => {
        setUserForLogin(null);
        setError(null);
        setView(View.LoginEmail);
    }

    const renderView = () => {
        switch (view) {
            case View.LoginEmail:
                return (
                    <div className="w-full max-w-[440px] space-y-8">
                        {/* Main Login: Follows Auth Flow */}
                        <LoginEmail 
                            onSubmit={handleEmailSubmit} 
                            onHelp={() => setView(View.Help)}
                            isLoading={isLoading} 
                            error={error} 
                        />
                        {/* Demo Buttons */}
                        <DemoUsers onSelect={handleDemoLogin} onReset={resetState} />
                    </div>
                );
            case View.Help:
                return <Help onBack={() => setView(View.LoginEmail)} />;
            case View.SystemStatus:
                return <SystemStatus onBack={() => setView(View.LoginEmail)} />;
            case View.LoginPassword:
                 return <LoginPassword 
                            onSubmit={handlePasswordSubmit} 
                            onForgotPassword={() => setView(View.ForgotPassword)}
                            onBack={handleBackToEmail}
                            isLoading={isLoading} 
                            error={error}
                            email={userForLogin!} 
                        />;
            case View.FirstTimeLogin:
                return <FirstTimeLogin 
                    onSubmit={handleFirstTimeSubmit} 
                    isLoading={isLoading} 
                    email={userForLogin!} 
                    onReset={resetState} 
                />;
            case View.Setup2FA:
                return <Setup2FA onComplete={handle2FASetupComplete} isLoading={isLoading} />;
            case View.Verify2FAAuthenticator:
                return <Verify2FAAuthenticator 
                    onVerify={(code) => handle2FAVerify(code, TwoFactorMethod.Authenticator)} 
                    onBack={handleBackToEmail} 
                    isLoading={isLoading} 
                    error={error} 
                />;
             case View.Verify2FAPin:
                return <Verify2FAPin 
                    onVerify={(code) => handle2FAVerify(code, TwoFactorMethod.Pin)} 
                    onBack={handleBackToEmail} 
                    onForgotPin={() => setView(View.ForgotPin)}
                    isLoading={isLoading} 
                    error={error} 
                />;
             case View.Verify2FASMS:
                return <Verify2FASMS 
                    onVerify={(code) => handle2FAVerify(code, TwoFactorMethod.SMS)} 
                    onBack={handleBackToEmail} 
                    onUpdatePhoneNumber={() => setView(View.UpdatePhoneNumber)}
                    isLoading={isLoading} 
                    error={error} 
                />;
            case View.ForgotPassword:
                return <ForgotPassword onResetRequest={handleForgotPasswordRequest} onBackToLogin={() => setView(View.LoginEmail)} onProceedToReset={handleProceedToReset} isLoading={isLoading} />;
            case View.ForgotPin:
                return <ForgotPin onBack={() => setView(View.Verify2FAPin)} isLoading={isLoading} onSubmit={handleForgotPinRequest} initialEmail={userForLogin || ''} />;
            case View.UpdatePhoneNumber:
                return <UpdatePhoneNumber onBack={() => setView(View.Verify2FASMS)} isLoading={isLoading} onSubmit={handleUpdatePhoneNumberRequest} initialEmail={userForLogin || ''} />;
            case View.AccountLocked:
                return <AccountLocked onBackToLogin={resetState} onResetPassword={() => setView(View.ForgotPassword)} />;
            case View.TempPasswordExpired:
                return <TempPasswordExpired onBackToLogin={resetState} onResetPassword={() => setView(View.ForgotPassword)} />;
            case View.Redirecting:
                return <Redirecting />;
            case View.Dashboard:
                return <Dashboard onLogout={resetState} />;
            case View.ResetPassword:
                return <ResetPassword onSubmit={handlePasswordReset} isLoading={isLoading} />;
            case View.ResetPasswordSuccess:
                return <ResetPasswordSuccess onBackToLogin={resetState} />;
            default:
                return <LoginEmail 
                            onSubmit={handleEmailSubmit} 
                            onHelp={() => setView(View.Help)}
                            isLoading={isLoading} 
                            error={error} 
                        />;
        }
    };

    return (
        <Layout onSystemStatusClick={() => setView(View.SystemStatus)}>
            {renderView()}
        </Layout>
    );
}
