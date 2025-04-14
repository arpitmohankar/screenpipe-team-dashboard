/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { exec, spawn } = require('child_process');
// Keep track of the Screenpipe process
let screenpipeProcess = null;
let recordingStartTime = null;

// Install Screenpipe CLI (Windows)
async function installScreenpipeCli() {
  return new Promise((resolve, reject) => {
    const command = 'powershell.exe';
    const args = ['-Command', 'iwr get.screenpi.pe/cli.ps1 | iex'];
    
    console.log('Installing Screenpipe CLI...');
    exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Installation error:', error);
        reject(`Installation failed: ${error.message}`);
      } else {
        console.log('Installation complete:', stdout);
        resolve('Screenpipe CLI installed successfully');
      }
    });
  });
}

// Start Screenpipe service
async function startScreenpipeService() {
  if (screenpipeProcess) {
    return 'Screenpipe process already running';
  }
  
  return new Promise((resolve, reject) => {
    try {
      const command = 'screenpipe';
      screenpipeProcess = spawn(command, [], { shell: true });
      recordingStartTime = Date.now();
      
      screenpipeProcess.stderr.on('data', (data) => {
        const message = data.toString().trim();
        console.log('Screenpipe output:', message);
        
        // Check if already running message
        if (message.includes('already running')) {
          screenpipeProcess = null;
          resolve('Screenpipe service already running');
        }
      });
      
      // Resolve after a short delay assuming it started
      setTimeout(() => {
        resolve('Screenpipe service started');
      }, 2000);
      
    } catch (error) {
      reject(`Failed to start Screenpipe: ${error.message}`);
    }
  });
}

// Analyze data using SDK
async function analyzeData() {
  try {
    // TODO: Replace with actual SDK usage
    // const sdk = new ScreenpipeSDK();
    // const endTime = Date.now();
    // const startTime = recordingStartTime || (endTime - 3600000); // Last hour if no start time
    // const data = await sdk.searchActivity({ startTime, endTime });
    
    // For development, use simulated data
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    
    const personalData = generatePersonalData();
    const teamData = generateTeamData(personalData);
    
    return {
      personalData,
      teamData
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error(`Data analysis failed: ${error.message}`);
  }
}

// Generate simulated personal data
function generatePersonalData() {
  const apps = ['VS Code', 'Chrome', 'Slack', 'Terminal', 'Zoom', 'Figma'];
  const data = {
    appUsage: {},
    taskSwitches: Math.floor(Math.random() * 50) + 20,
    totalTime: 0
  };
  
  // Generate random usage times
  apps.forEach(app => {
    const minutes = Math.floor(Math.random() * 120) + 10;
    data.appUsage[app] = minutes * 60 * 1000; // Convert to ms
    data.totalTime += data.appUsage[app];
  });
  
  return data;
}

// Generate simulated team data
function generateTeamData(personalData) {
  const teamMembers = ['You', 'Alex', 'Taylor', 'Jordan'];
  const teamData = {
    members: {},
    totalTime: 0,
    avgTaskSwitches: 0
  };
  
  // Add personal data
  teamData.members['You'] = {
    appUsage: personalData.appUsage,
    taskSwitches: personalData.taskSwitches
  };
  teamData.totalTime += personalData.totalTime;
  teamData.avgTaskSwitches += personalData.taskSwitches;
  
  // Generate data for other team members
  teamMembers.slice(1).forEach(member => {
    const memberData = {
      appUsage: {},
      taskSwitches: Math.floor(Math.random() * 50) + 20
    };
    
    let memberTotal = 0;
    Object.keys(personalData.appUsage).forEach(app => {
      // Vary by ±30% from personal data
      const variance = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
      memberData.appUsage[app] = Math.floor(personalData.appUsage[app] * variance);
      memberTotal += memberData.appUsage[app];
    });
    
    teamData.members[member] = memberData;
    teamData.totalTime += memberTotal;
    teamData.avgTaskSwitches += memberData.taskSwitches;
  });
  
  teamData.avgTaskSwitches /= teamMembers.length;
  
  return teamData;
}

module.exports = {
  installScreenpipeCli,
  startScreenpipeService,
  analyzeData
};
