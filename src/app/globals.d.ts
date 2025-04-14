/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/globals.d.ts
interface Window {
    electron: {
      screenpipe: {
        installCli: () => Promise<string>;
        startService: () => Promise<string>;
        analyzeData: () => Promise<any>;
      }
    }
  }
  