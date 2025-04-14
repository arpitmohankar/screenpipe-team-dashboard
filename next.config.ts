/* eslint-disable @typescript-eslint/no-explicit-any */
// next.config.js
module.exports = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  webpack: (config: any) => {
    // Ignore electron-specific files in Next.js compilation
    config.externals.push({
      electron: 'electron'
    });
    return config;
  }
};
