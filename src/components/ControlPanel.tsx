import React from 'react';

interface ControlPanelProps {
  onInstall: () => Promise<void>;
  onStart: () => Promise<void>;
  onAnalyze: () => Promise<void>;
  status: string;
  loading: boolean;
}

export default function ControlPanel({ onInstall, onStart, onAnalyze, status, loading }: ControlPanelProps) {
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={onInstall}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Install Screenpipe CLI
        </button>
        
        <button
          onClick={onStart}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Start Screenpipe Service
        </button>
        
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Analyze Data
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-white rounded border">
        <p className="font-medium">Status: {loading ? 'Loading...' : status}</p>
      </div>
    </div>
  );
}
