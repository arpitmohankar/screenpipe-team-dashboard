import React from 'react';
import { Pie } from 'react-chartjs-2';

interface UserStatsData {
  appUsage: Record<string, number>;
  totalTime: number;
  taskSwitches: number;
}

export default function UserStats({ data }: { data: UserStatsData }) {
  if (!data) return null;
  
  // Prepare chart data
  const appNames = Object.keys(data.appUsage);
  const appTimeMinutes = Object.values(data.appUsage).map(
    (ms) => Math.round((ms as number) / (60 * 1000))
  );
  
  const chartData = {
    labels: appNames,
    datasets: [
      {
        data: appTimeMinutes,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const totalTimeHours = Math.round((data.totalTime / (3600 * 1000)) * 10) / 10;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Activity</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-lg font-semibold">{totalTimeHours} hours</p>
          <p className="text-sm text-gray-500">Total Tracked Time</p>
        </div>
        <div className="bg-gray-50 p-4 rounded text-center">
          <p className="text-lg font-semibold">{data.taskSwitches}</p>
          <p className="text-sm text-gray-500">Task Switches</p>
        </div>
      </div>
      
      <div className="mt-6" style={{ height: '300px' }}>
        <h3 className="text-lg font-semibold mb-2">App Usage Distribution</h3>
        <div className="h-full">
          <Pie 
            data={chartData} 
            options={{ maintainAspectRatio: false }} 
          />
        </div>
      </div>
    </div>
  );
}
