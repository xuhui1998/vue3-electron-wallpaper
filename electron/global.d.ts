// global.d.ts
interface MessageBoxOptions {
  type: 'none' | 'info' | 'error' | 'question' | 'warning';
  title: string;
  message: string;
  buttons?: string[];
  // ...还可以包含更多的 Electron MessageBoxOptions 属性
}

interface MessageBoxReturnValue {
  response: number; // 用户点击按钮的索引
  checkboxChecked?: boolean; // 用户是否勾选了复选框（如果可用的话）
}
declare global {
  interface Window {
    electronAPI: {
      setWallpaper: (path: string) => void;
      showMessageBox: (options: MessageBoxOptions) => Promise<MessageBoxReturnValue>;
    };
  }
}

export default global