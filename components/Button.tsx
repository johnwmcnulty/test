import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ isLoading = false, children, fullWidth = true, variant = 'primary', ...props }) => {
  const baseStyles = "flex justify-center items-center font-semibold py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm text-sm";
  
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-400 text-white focus:ring-cyan-500 focus:ring-offset-white border border-transparent",
    secondary: "bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-800 focus:ring-gray-400 focus:ring-offset-white border border-gray-200"
  };

  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${fullWidth ? 'w-full' : 'px-6'} ${baseStyles} ${variants[variant]}`}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};