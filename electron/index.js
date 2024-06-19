const path = require('path')
const { exec } = require('child_process')
const os = require('os')
const http = require('http')
const fs = require('fs')

// 导入electronAPI
const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')

require('electron-reload')(__dirname)

// 初始化桌面端应用
function createWindow() {
  // TODO: 根据不同环境设置不同的应用配置
  const isDev = process.env.IS_DEV === 'true'
  console.log(isDev, 'isDev')
  // console.log(iconPath);

  // 主窗口
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '/icon/win-icon.ico'),
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
  // mac设置应用图标
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, '/icon/mac-icon.icns'))
  }

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

  mainWindow.setMenu(null)
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
  const callback = async (downloadError) => {
    if (downloadError) {
      console.error(`下载错误: ${downloadError}`)
      return
    }

    // 图片下载完成后，设置为桌面壁纸
    const macCommand = `osascript -e 'tell application "Finder" to set desktop picture to POSIX file "${downloadPath}"'`
    const winCommand = `powershell -Command "$reg = New-Object -ComObject WScript.Shell; $reg.RegWrite('HKCU:Control Panel\\Desktop\\Wallpaper', '${downloadPath}', 'REG_SZ'); $reg.RegWrite('HKCU:Control Panel\\Desktop\\WallpaperStyle', 10, 'REG_DWORD'); RUNDLL32.EXE user32.dll, UpdatePerUserSystemParameters , 1, True"`

    // windows平台
    if (process.platform === 'win32') {
      exec(winCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(`执行的错误: ${err}`)
          dialog.showErrorBox('提示', '设置出错')
          return
        }
        dialog.showErrorBox('提示', '设置成功')
        console.log('壁纸已更改！')
      })
    } else if (process.platform === 'darwin') {
      // mac平台
      exec(macCommand, (err, stdout, stderr) => {
        if (err) {
          console.error(`执行的错误: ${err}`)
          dialog.showMessageBox({
            type: 'error',
            title: '提示',
            message: '设置出错',
            buttons: ['好的']
          })
          return
        }
        console.log('壁纸已更改！')
        dialog.showMessageBox({
          type: 'question',
          title: '提示',
          message: '设置成功',
          buttons: ['好的']
        })
        // 删除下载的图片
        fs.unlink(downloadPath, (deleteErr) => {
          if (deleteErr) {
            console.error(`删除文件错误: ${deleteErr}`)
            return
          }
        })
      })
    }
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
