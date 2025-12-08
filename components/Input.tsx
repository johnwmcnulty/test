import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  endIcon?: React.ReactNode;
  error?: string | null;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, endIcon, error, ...props }, ref) => {
    return (
      <div className="group">
        <label htmlFor={id} className={`block text-sm font-medium mb-1.5 transition-colors ${error ? 'text-red-600' : 'text-gray-700 group-focus-within:text-cyan-700'}`}>
          {label}
        </label>
        <div className="relative">
          <input
            {...props}
            id={id}
            ref={ref}
            className={`w-full bg-white border text-gray-900 rounded-md py-2.5 px-3.5 focus:outline-none focus:ring-2 transition-all shadow-sm placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500 ${
              error 
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                : 'border-gray-300 focus:ring-cyan-500/20 focus:border-cyan-500'
            }`}
          />
          {endIcon && <div className="absolute inset-y-0 right-0 pr-3 flex items-center">{endIcon}</div>}
        </div>
        {error && (
          <div className="mt-1.5 flex items-start text-sm text-red-600 animate-pulse-once">
             <svg className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
             </svg>
             <span className="leading-5">{error}</span>
          </div>
        )}
      </div>
    );
  }
);