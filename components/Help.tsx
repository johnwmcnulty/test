
import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface HelpProps {
  onBack: () => void;
}

const FAQItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => (
  <div className="border-b border-gray-100 py-4 last:border-0">
    <h3 className="text-sm font-semibold text-gray-900 mb-2">{question}</h3>
    <div className="text-sm text-gray-600 leading-relaxed space-y-2">{answer}</div>
  </div>
);

export const Help: React.FC<HelpProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact'>('faq');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [formData, setFormData] = useState({
      email: '',
      subject: 'Login Issue',
      message: ''
  });

  const handleSendSupport = (e: React.FormEvent) => {
      e.preventDefault();
      setIsSending(true);
      // Simulate API call
      setTimeout(() => {
          setIsSending(false);
          setIsSent(true);
      }, 1500);
  };

  return (
    <Card>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Help & Support</h2>
        <p className="text-sm text-gray-500 mt-1">Troubleshooting guide and support contact.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('faq')}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'faq' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
              Troubleshooting
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex-1 pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'contact' ? 'border-cyan-600 text-cyan-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
              Contact Support
          </button>
      </div>

      <div className="h-96 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {activeTab === 'faq' ? (
            <div className="space-y-1">
                <FAQItem 
                    question="I forgot my password or it's not working." 
                    answer={
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            <li>Ensure <strong>Caps Lock</strong> is turned off. Passwords are case-sensitive.</li>
                            <li>If you can't remember it, use the <strong>Forgot Password</strong> link on the login screen.</li>
                            <li>Check your <strong>Spam/Junk</strong> folder for the reset email. It usually arrives within 2 minutes.</li>
                        </ul>
                    } 
                />
                <FAQItem 
                    question="My 2FA Authenticator code is invalid." 
                    answer={
                        <>
                            <p>This usually happens when the time on your phone is not synced with the server.</p>
                            <p className="mt-2 font-medium text-xs uppercase text-gray-500">How to fix:</p>
                            <ul className="list-disc list-inside pl-1">
                                <li><strong>Android:</strong> Go to Settings &gt; Date & Time &gt; Enable "Automatic Date & Time".</li>
                                <li><strong>iOS:</strong> Go to Settings &gt; General &gt; Date & Time &gt; Enable "Set Automatically".</li>
                            </ul>
                            <p className="mt-1">Once synced, generate a new code and try again.</p>
                        </>
                    } 
                />
                <FAQItem 
                    question="I'm not receiving SMS codes." 
                    answer={
                        <ul className="list-disc list-inside space-y-1 pl-1">
                            <li>Wait at least 2 minutes before requesting a new code.</li>
                            <li>Restart your mobile device to refresh the network connection.</li>
                            <li>Check if you have blocked "Short Code" messages in your phone settings.</li>
                        </ul>
                    } 
                />
                <FAQItem 
                    question="My account is locked." 
                    answer="If you enter an incorrect password 5 times, your account locks automatically for 30 minutes. You can wait for the timer to expire or contact support immediately to unlock it manually." 
                />
                <FAQItem 
                    question="Browser Issues (Looping or Blank Screen)" 
                    answer={
                        <>
                            <p>If the login page keeps reloading or appears broken:</p>
                            <ul className="list-disc list-inside pl-1 mt-1">
                                <li>Clear your browser's <strong>cache and cookies</strong>.</li>
                                <li>Try opening the page in an <strong>Incognito/Private</strong> window.</li>
                                <li>Ensure you are using a supported browser (Chrome, Edge, Firefox, or Safari).</li>
                            </ul>
                        </>
                    } 
                />
            </div>
        ) : (
            <>
                {isSent ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">Message Sent!</h3>
                        <p className="text-gray-500 mt-2">Our support team has received your request. We typically respond within 1-2 hours.</p>
                        <button 
                            onClick={() => { setIsSent(false); setFormData({ ...formData, message: ''}); }}
                            className="mt-6 text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                        >
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSendSupport} className="space-y-4 pt-1">
                        <p className="text-xs text-gray-500 mb-2">Fill out the form below and our IT support team will reach out to you directly.</p>
                        <Input 
                            id="help-email"
                            label="Your Email"
                            type="email"
                            required
                            placeholder="user@cybcube.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                         <div>
                            <label htmlFor="help-subject" className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                            <select
                                id="help-subject"
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                            >
                                <option>Login Issue</option>
                                <option>2FA Reset Request</option>
                                <option>Account Locked</option>
                                <option>Other Technical Issue</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="help-message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                id="help-message"
                                rows={4}
                                required
                                className="w-full bg-white border border-gray-300 text-gray-900 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-none"
                                placeholder="Please describe the issue you are facing..."
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>
                        <div className="pt-2">
                            <Button type="submit" isLoading={isSending}>
                                Send Message
                            </Button>
                        </div>
                    </form>
                )}
            </>
        )}
      </div>

      <div className="pt-2 border-t border-gray-100">
        <button 
            onClick={onBack}
            className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors py-2"
        >
            &larr; Back to Sign In
        </button>
      </div>
    </Card>
  );
};
