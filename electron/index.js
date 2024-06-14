const path = require('path')
const { exec } = require('child_process')
const os = require('os')
const http = require('http')
const fs = require('fs')

// 导入electronAPI
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')

require('electron-reload')(__dirname)

const iconPath =
  process.platform === 'win32'
    ? path.join(__dirname, 'favicon.png')
    : path.join(__dirname, 'favicon.png')

// 初始化桌面端应用
function createWindow() {
  // TODO: 根据不同环境设置不同的应用配置
  const isDev = process.env.IS_DEV === 'true'
  console.log(isDev, 'isDev')

  // 主窗口
  let mainWindow = null
  mainWindow = new BrowserWindow({
    icon: iconPath,
    width: 800,
    height: 500,
    fullscreenable: false,
    fullscreen: false,
    simpleFullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, 'preload.js')
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
    mainWindow.webContents.send('window-resize')
  })
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

// 设置壁纸
ipcMain.on('set-wallpaper', async (event, imageUrl) => {
  const downloadPath = path.join(os.homedir(), 'Downloads', `${new Date().getTime()}.jpg`)
  // 当图片下载完成后的回调
  const callback = (downloadError) => {
    if (downloadError) {
      console.error(`下载错误: ${downloadError}`)
      return
    }

    // 图片下载完成后，设置为桌面壁纸
    const command = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${downloadPath}"'`

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(`执行的错误: ${err}`)
        return
      }
      console.log('壁纸已更改！')
      // 删除下载的图片
      fs.unlink(downloadPath, (deleteErr) => {
        if (deleteErr) {
          console.error(`删除文件错误: ${deleteErr}`)
          return
        }
      })
    })
  }
  // 下载图片
  const file = fs.createWriteStream(downloadPath)
  const request = http
    .get(imageUrl, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close(callback)
      })
    })
    .on('error', (err) => {
      fs.unlink(downloadPath) // 在失败时删除文件
      console.error(`请求错误: ${err.message}`)
    })

  file.on('error', (err) => {
    fs.unlink(downloadPath) // 在文件错误中删除文件
    console.error(`文件错误: ${err.message}`)
  })
})

// 系统弹窗
ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(options)
  return result
})

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
