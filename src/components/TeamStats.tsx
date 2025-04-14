import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

interface MemberData {
  appUsage: Record<string, number>;
}

interface TeamData {
  members: Record<string, MemberData>;
  totalTime: number;
  avgTaskSwitches: number;
}

export default function TeamStats({ data }: { data: TeamData | null }) {
  const aggregatedAppUsage = useMemo(() => {
    if (!data) return {};

    const result: Record<string, number> = {};
    
    Object.entries(data.members).forEach(([, memberData]) => {
      Object.entries(memberData.appUsage).forEach(([app, time]) => {
        if (!result[app]) result[app] = 0;
        result[app] += time;
      });
    });
    
    // Convert to minutes and sort
    return Object.fromEntries(
      Object.entries(result)
        .map(([app, time]) => [app, time / (60 * 1000)])
        .sort((a, b) => (b[1] as number) - (a[1] as number))
    );
  }, [data]);

  if (!data) return null;
  
  // Prepare chart data
  const chartData = {
    labels: Object.keys(aggregatedAppUsage),
    datasets: [
      {
        label: 'Minutes',
        data: Object.values(aggregatedAppUsage),
        backgroundColor: '#4BC0C0',
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate team metrics
  const memberCount = Object.keys(data.members).length;
  const totalTimeHours = Math.round((data.totalTime / (3600 * 1000)) * 10) / 10;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Team Overview</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-lg font-semibold">{memberCount}</p>
          <p className="text-sm text-gray-500">Team Members</p>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-lg font-semibold">{totalTimeHours} hours</p>
          <p className="text-sm text-gray-500">Combined Time</p>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-lg font-semibold">{Math.round(data.avgTaskSwitches)}</p>
          <p className="text-sm text-gray-500">Avg. Task Switches</p>
        </div>
      </div>
      
      <div className="mt-6" style={{ height: '300px' }}>
        <h3 className="text-lg font-semibold mb-2">Team App Usage (Minutes)</h3>
        <div className="h-full">
          <Bar 
            data={chartData} 
            options={{ 
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }} 
          />
        </div>
      </div>
    </div>
  );
}
