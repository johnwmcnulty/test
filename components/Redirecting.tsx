import React from 'react';
import { Card } from './Card';

export const Redirecting: React.FC = () => {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Verified</h2>
        <p className="text-gray-500 text-center">
          You will be redirected to your page soon.
        </p>
      </div>
    </Card>
  );
};
