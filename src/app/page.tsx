/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react';
import ControlPanel from '@/components/ControlPanel';
import UserStats from '@/components/UserStats';
import TeamStats from '@/components/TeamStats';

// Debug global API
console.log('Window object:', typeof window !== 'undefined' ? 'available' : 'undefined');
if (typeof window !== 'undefined') {
  console.log('Electron object:', window.electron ? 'available' : 'missing');
  if (window.electron) {
    console.log('Screenpipe object:', window.electron.screenpipe ? 'available' : 'missing');
  }
}

export default function Home() {
  const [status, setStatus] = useState('Ready');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  
  // Check if the API is available
  useEffect(() => {
    const checkApiAvailability = () => {
      const electronAvailable = typeof window !== 'undefined' && 
                              window.electron !== undefined;
      const screenpipeAvailable = electronAvailable && 
                                window.electron.screenpipe !== undefined;
      
      setApiAvailable(screenpipeAvailable);
      
      if (!screenpipeAvailable) {
        console.warn(
          'API not available:',
          electronAvailable ? 'electron exists but screenpipe missing' : 'electron missing'
        );
        
        // If in development, use mock data for UI testing
        if (process.env.NODE_ENV === 'development') {
          setStatus('Using development mock data (API not available)');
        }
      } else {
        console.log('API is fully available');
      }
    };
    
    // Check immediately
    checkApiAvailability();
    
    // Also check after a delay to allow possible late initialization
    const timer = setTimeout(checkApiAvailability, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Wrapper function for API calls
  const safeApiCall = async (
    apiFunction: () => Promise<any>,
    actionName: string
  ) => {
    if (!apiAvailable) {
      console.error(`Cannot call ${actionName}: API not available`);
      setStatus(`Error: Electron API not available for ${actionName}`);
      return null;
    }
    
    try {
      return await apiFunction();
    } catch (error) {
      console.error(`Error in ${actionName}:`, error);
      return null;
    }
  };
  
  const handleInstall = async () => {
    setLoading(true);
    setStatus('Installing Screenpipe CLI...');
    
    try {
      // Only proceed if API is available
      if (!apiAvailable) {
        throw new Error('Electron API not available');
      }
      
      const result = await window.electron.screenpipe.installCli();
      setStatus(`Installation complete: ${result}`);
    } catch (error) {
      console.error('Installation error:', error);
      setStatus(`Installation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Similar changes for handleStart and handleAnalyze
  
  // For development testing when API isn't available
  const handleMockAnalyze = () => {
    setLoading(true);
    setStatus('Analyzing with mock data...');
    
    // Simulate async operation
    setTimeout(() => {
      setAnalysisData({
        personalData: {
          appUsage: { 'VS Code': 3600000, 'Chrome': 2400000, 'Slack': 1800000 },
          taskSwitches: 25,
          totalTime: 7800000
        },
        teamData: {
          members: {
            'You': { appUsage: { 'VS Code': 3600000, 'Chrome': 2400000, 'Slack': 1800000 }, taskSwitches: 25 },
            'Alex': { appUsage: { 'VS Code': 2800000, 'Chrome': 3100000, 'Slack': 1500000 }, taskSwitches: 18 },
            'Taylor': { appUsage: { 'VS Code': 4200000, 'Chrome': 1800000, 'Slack': 2200000 }, taskSwitches: 30 }
          },
          totalTime: 23000000,
          avgTaskSwitches: 24
        }
      });
      setStatus('Analysis complete (mock data)');
      setLoading(false);
    }, 1000);
  };
  
  return (
    <main className="flex min-h-screen flex-col p-8">
      <h1 className="text-4xl font-bold mb-8">Team Screen Activity Dashboard</h1>
      
      {!apiAvailable && (
        <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500">
          Warning: Electron API not available. Running in development/browser mode with limited functionality.
        </div>
      )}
      
      <ControlPanel
        onInstall={handleInstall}
        onStart={apiAvailable ? handleStart : () => handleMockAnalyze()}
        onAnalyze={apiAvailable ? handleAnalyze : handleMockAnalyze}
        status={status}
        loading={loading}
        disabled={loading}
      />
      
      {analysisData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <UserStats data={analysisData.personalData} />
          <TeamStats data={analysisData.teamData} />
        </div>
      )}
    </main>
  );
}
