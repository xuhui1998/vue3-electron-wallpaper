// global.d.ts
declare global {
  interface Window {
    electronAPI: {
      setWallpaper: (path: string) => void;
    };
  }
}

export default global