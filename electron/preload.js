const { contextBridge, ipcRenderer } = require('electron')

console.log('Preload script running')

contextBridge.exposeInMainWorld('electronAPI', {
  setWallpaper: (path) => ipcRenderer.send('set-wallpaper', path),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
})
