import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.planet_bluto.bolta',
  appName: 'bolta-tasks',
  webDir: 'dist',
  plugins: {
    BackgroundRunner: {
      label: "net.planet-bluto.bolta.background",
      src: "background.js",
      event: "reminder",
      repeat: true,
      interval: 15,
      autoStart: true,
    },
  },
};

export default config;
