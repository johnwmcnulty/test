import React from 'react';

interface WelcomeEmailPreviewProps {
  email: string;
  isEmbedded?: boolean;
  onReset?: () => void;
}

const EmailContent: React.FC<{email: string; onReset?: () => void}> = ({ email, onReset }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500">
            <span className="font-semibold text-gray-700">From:</span> CyberCube Security &lt;noreply@cybcube.com&gt;
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-semibold text-gray-700">To:</span> {email}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            <span className="font-semibold text-gray-700">Subject:</span> Welcome to CyberCube - Your Account is Ready
          </p>
        </div>
        <div className="p-4 text-sm">
          <h3 className="font-semibold text-gray-900">Welcome to the CyberCube Analytics Platform!</h3>
          <p className="mt-2 text-gray-600">
            An administrator has created an account for you. To get started, please use the login link, your email address (username), and the temporary password provided below.
          </p>
          
          <div className="my-4 text-center">
            <a 
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    if (onReset) {
                        onReset();
                    } else {
                        window.location.reload();
                    }
                }} 
                className="inline-block w-full text-center bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
                Go to Login Page
            </a>
          </div>

          <p className="mt-4 text-gray-600">
            Upon your first login, you will be prompted to create a new, permanent password.
          </p>

          <div className="my-4 p-3 bg-gray-100 rounded-md text-center border border-gray-200">
            <p className="text-xs text-gray-500">Your temporary password is:</p>
            <p className="text-lg font-mono tracking-wider text-cyan-600">1234</p>
          </div>
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Please note:</span> For security reasons, this temporary password is valid for 7 days. If it expires, you will need to request a new invitation from your organization’s administrator.
          </p>
          <hr className="my-4 border-gray-200" />
          <p className="text-xs text-gray-400">
            For assistance, please contact your administrator at &lt;admin-email@cybcube.com&gt; or via your internal helpdesk. If you did not expect this email, please disregard it.
          </p>
        </div>
      </div>
);

export const WelcomeEmailPreview: React.FC<WelcomeEmailPreviewProps> = ({ email, isEmbedded = true, onReset }) => {
  if (isEmbedded) {
    return (
        <div className="my-6 p-4 border border-dashed border-gray-300 rounded-md bg-gray-50">
            <p className="text-sm text-center text-gray-500 mb-4">
                For demo purposes, here's what the welcome email looks like:
            </p>
            <EmailContent email={email} onReset={onReset} />
        </div>
    );
  }
  
  return <EmailContent email={email} onReset={onReset} />;
};