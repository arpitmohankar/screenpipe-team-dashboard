/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/electron.d.ts
interface ElectronWindow extends Window {
    electron: {
      screenpipe: {
        installCli: () => Promise<string>;
        startService: () => Promise<string>;
        analyzeData: () => Promise<any>;
      }
    }
  }
  
  declare global {
    interface Window extends ElectronWindow {}
  }
  
  export {};
  