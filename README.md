<!--
 * @Author: 徐辉 xh13865339252@163.com
 * @Date: 2024-04-15 17:53:45
 * @LastEditors: 徐辉 xh13865339252@163.com
 * @LastEditTime: 2025-05-30 10:21:18
 * @FilePath: /vue3-vite-eletron/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 绮梦花 - 优雅的桌面壁纸应用

绮梦花是一款基于 Electron + Vue3 开发的现代化桌面壁纸应用，为用户提供精美的壁纸资源和便捷的壁纸管理功能。

## 技术栈

- Electron - 跨平台桌面应用开发框架
- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- TypeScript - JavaScript 的超集，提供类型系统

## 推荐开发环境

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (请禁用 Vetur)

## 项目设置

```sh
# 安装依赖
npm install
```

### 开发环境运行

```sh
# 启动开发服务器（支持热重载）
npm run electron:start
```

### 打包应用

```sh
# 类型检查、编译和压缩
npm run package-mac
```

### 代码检查

```sh
# 使用 ESLint 进行代码检查
npm run lint
```

## 主要功能

- 精选壁纸展示
- 壁纸分类浏览
- 自动更换壁纸
- 壁纸下载功能

## 项目结构

```
├── src/                # 源代码目录
│   ├── main/          # Electron 主进程代码
│   ├── views/      # Vue 渲染进程代码
│   └── assets/        # 静态资源
├── electron/          # Electron 相关配置
└── package.json       # 项目配置文件
```

## 开发指南

1. 确保已安装 Node.js (推荐 v16 或更高版本)
2. 克隆项目并安装依赖
3. 运行开发服务器
4. 开始开发！

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

[MIT License](LICENSE)
