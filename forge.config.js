const { FusesPlugin } = require('@electron-forge/plugin-fuses')
const { FuseV1Options, FuseVersion } = require('@electron/fuses')

module.exports = {
  packagerConfig: {
    name: '绮梦花',
    productName: '绮梦花壁纸',
    out: './',
    overwrite: true,
    asar: true,
    icon: '/electron/icon/icon.png',
    version: '1.0.0', // 应用程序版本号
    copyright: 'Copyright © 2024' // 版权信息
  },
  win: {
    // Windows平台的配置
    target: 'nsis', // 打包的目标格式为NSIS安装程序
    icon: '/electron/icon/win-icon.ico', // Windows平台的图标路径
    publisherName: 'Hui Xu', // 发布者名称
    fileAssociations: [
      // 关联文件类型的配置
      {
        ext: 'myext', // 文件扩展名
        name: 'My Extension', // 文件类型名称
        description: 'Open My Extension files', // 文件类型描述
        role: 'Editor' // 文件类型的角色
      }
    ],
    certificateFile: 'path/to/certificate.pfx', // 数字证书文件的路径
    certificatePassword: 'password123' // 数字证书的密码
  },
  mac: {
    // macOS平台的配置
    target: 'dmg', // 打包的目标格式为DMG镜像
    icon: '/electron/icon/mac-icon.icns', // macOS平台的图标路径
    category: 'public.app-category.utilities', // 应用程序的分类
    extendInfo: {
      // 扩展应用程序包的配置
      NSAppTransportSecurity: {
        NSAllowsArbitraryLoads: true // 允许应用程序加载任意的网络资源
      }
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {}
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
}
