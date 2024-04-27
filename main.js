// main.ts
// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html
  // 在官方案例中展示的是 index.html 的内容
  // mainWindow.loadFile('index.html')
  mainWindow.loadURL('http://127.0.0.1:5173/')

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
