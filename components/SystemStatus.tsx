
import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

interface SystemStatusProps {
  onBack: () => void;
}

const StatusItem: React.FC<{ name: string; status: 'operational' | 'degraded' | 'outage' }> = ({ name, status }) => {
  const colors = {
    operational: 'text-green-700 bg-green-50 border-green-200',
    degraded: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    outage: 'text-red-700 bg-red-50 border-red-200',
  };
  const labels = {
    operational: 'Operational',
    degraded: 'Degraded',
    outage: 'Outage',
  };
  const indicatorColors = {
      operational: 'bg-green-500',
      degraded: 'bg-yellow-500',
      outage: 'bg-red-500'
  }

  return (
    <div className="flex items-center justify-between py-3 px-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-center">
        <span className={`h-2.5 w-2.5 rounded-full mr-3 ${indicatorColors[status]} ring-1 ring-white shadow-sm`}></span>
        <span className="text-sm font-medium text-gray-700">{name}</span>
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colors[status]}`}>
        {labels[status]}
      </span>
    </div>
  );
};

export const SystemStatus: React.FC<SystemStatusProps> = ({ onBack }) => {
  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center justify-center mb-4">
             {/* CyberCube Logo mark for context */}
             <div className="w-8 h-8 mr-2">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#10b981" />
                    <rect x="35" y="35" width="30" height="30" fill="white" />
                    <rect x="65" y="48" width="35" height="4" fill="white" />
                </svg>
             </div>
             <h2 className="text-xl font-bold text-gray-900">System Status</h2>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center shadow-sm">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            </div>
            <div className="ml-3">
            <h3 className="text-sm font-bold text-green-800">All Systems Operational</h3>
            <p className="text-xs text-green-600 mt-0.5">Last updated: Just now</p>
            </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Service Health</h3>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <StatusItem name="Authentication Service" status="operational" />
            <StatusItem name="Identity Provider (IdP)" status="operational" />
            <StatusItem name="User Database" status="operational" />
            <StatusItem name="API Gateway" status="operational" />
            <StatusItem name="SMS Delivery Gateway" status="operational" />
            <StatusItem name="Analytics Engine" status="operational" />
        </div>
      </div>

      <div className="mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Past Incidents</h3>
          <div className="text-sm text-gray-500 bg-gray-50 rounded-md p-3 border border-gray-100">
            <p>No incidents reported today.</p>
          </div>
      </div>

      <div className="pt-2">
        <Button onClick={onBack} variant="secondary">
            &larr; Back to Application
        </Button>
      </div>
    </Card>
  );
};
