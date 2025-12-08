
import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { EyeIcon } from './icons/EyeIcon';
import { EyeOffIcon } from './icons/EyeOffIcon';

interface ResetPasswordProps {
  onSubmit: (password: string) => void;
  isLoading: boolean;
}

const PasswordRequirement: React.FC<{isValid: boolean; text: string}> = ({ isValid, text }) => (
    <li className={`flex items-center transition-colors ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
        </svg>
        {text}
    </li>
);

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSubmit, isLoading }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false,
  });

  useEffect(() => {
    setPasswordCriteria({
        length: newPassword.length >= 8,
        uppercase: /[A-Z]/.test(newPassword),
        lowercase: /[a-z]/.test(newPassword),
        number: /[0-9]/.test(newPassword),
        specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
    });
  }, [newPassword]);
  
  const allCriteriaMet = Object.values(passwordCriteria).every(Boolean);
  const passwordsMatch = newPassword && newPassword === confirmPassword;
  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;

  const getStrengthColor = () => {
    if (strengthScore <= 1) return 'bg-red-600';
    if (strengthScore === 2) return 'bg-orange-500';
    if (strengthScore === 3) return 'bg-yellow-500';
    if (strengthScore === 4) return 'bg-lime-500';
    return 'bg-green-600';
  };

  const getStrengthLabel = () => {
      if (strengthScore === 0) return '';
      if (strengthScore <= 1) return 'Very Weak';
      if (strengthScore === 2) return 'Weak';
      if (strengthScore === 3) return 'Medium';
      if (strengthScore === 4) return 'Strong';
      return 'Very Strong';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (allCriteriaMet && passwordsMatch) {
        onSubmit(newPassword);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">Reset Your Password</h2>
      <p className="text-sm text-center text-gray-500 mb-6">Your identity has been verified. Please create a new, strong password for your account.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Input
            id="new-password"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            endIcon={
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
                >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            }
            />
            {/* Password Strength Meter */}
            {newPassword && (
                <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-gray-700">Password Strength</span>
                        <span className={`text-xs font-bold ${strengthScore <= 2 ? 'text-red-500' : strengthScore <= 4 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {getStrengthLabel()}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`} 
                            style={{ width: `${Math.max(5, (strengthScore / 5) * 100)}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>

        <ul className="text-xs space-y-1 pl-2">
            <PasswordRequirement isValid={passwordCriteria.length} text="At least 8 characters"/>
            <PasswordRequirement isValid={passwordCriteria.uppercase} text="One uppercase letter"/>
            <PasswordRequirement isValid={passwordCriteria.lowercase} text="One lowercase letter"/>
            <PasswordRequirement isValid={passwordCriteria.number} text="One number"/>
            <PasswordRequirement isValid={passwordCriteria.specialChar} text="One special character"/>
        </ul>
        <Input
          id="confirm-password"
          label="Confirm New Password"
          type={showPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPassword && !passwordsMatch && <p className="text-xs text-red-500">Passwords do not match.</p>}
        
        <div className="pt-2">
            <Button type="submit" isLoading={isLoading} disabled={!allCriteriaMet || !passwordsMatch}>
                Reset Password
            </Button>
        </div>
      </form>
    </Card>
  );
};
