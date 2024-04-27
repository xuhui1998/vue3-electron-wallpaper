const path = require('path')

// 导入electronAPI
const { app, BrowserWindow, Menu, ipcMain } = require('electron')

require('electron-reload')(__dirname)

// 初始化桌面端应用
function createWindow() {
  // TODO: 根据不同环境设置不同的应用配置
  const isDev = process.env.IS_DEV === 'true'
  console.log(isDev, 'isDev')

  // 主窗口
  let mainWindow = null

  mainWindow = new BrowserWindow({
    fullscreenable: false,
    fullscreen: false,
    simpleFullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  })

  // 如果当前为开发环境,则执行开发环境的配置
  if (isDev) {
    // 打开控制台
    mainWindow.webContents.openDevTools()
  }

  // 载入应用的 index.html 或开发环境的 URL
  const URL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`
  mainWindow.loadURL(URL)

  // 当窗口被调整大小时发送事件到渲染器进程
  mainWindow.on('resize', () => {
    mainWindow.webContents.send('window-resize');
  });
}

// const template = [
//   {
//     label: 'View',
//     submenu: [
//       { role: 'reload' },
//       { role: 'forcereload' },
//       { role: 'toggledevtools' }, // 这个角色切换开发者工具的开与关
//       // 其他菜单项...
//     ]
//   },
//   // 其他顶级菜单...
// ]
// const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)

// 此方法将在Electron完成后调用,初始化,并准备创建浏览器窗口。
app.whenReady().then(() => {
  // 创建windows应用
  createWindow()

  app.on('activate', function () {
    // 如果应用激活后,窗口依然为0,则重新创建windows应用
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 应用销毁触发
app.on('window-all-closed', () => {
  // 对于 macOS 应用，除非用户使用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持活跃。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
