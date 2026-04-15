# 🚀 FaroAI Website

> 现代化 AI 服务网站 | Vue 3 + Vite + Tailwind CSS

![部署状态](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue)
![状态](https://img.shields.io/badge/状态-开发中-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ 特点

- ⚡ **极速加载** - Vite 构建，instant 开发体验
- 📱 **响应式设计** - 完美适配各种设备
- 🌓 **暗色模式** - 一键切换主题
- 🎨 **精美 UI** - 现代渐变色彩与流畅动画
- 🚀 **SEO 友好** - 优化的搜索引擎排名

## 🛠️ 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **部署**: GitHub Pages + Cloudflare

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 访问地址

- 本地开发：`http://localhost:5173/`
- 局域网访问：`http://你的 IP:5173/`

## 📝 部署

### GitHub Pages

1. **配置仓库**
   ```bash
   ./setup-git.sh
   ```

2. **首次部署**
   ```bash
   # 提交代码
   git add .
   git commit -m "Initial commit"
   
   # 推送到 GitHub
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source: 选择 `gh-pages` 分支
   - 等待部署完成

### 自动部署

推送到 `main` 分支后，GitHub Actions 会自动构建并部署。

### 自定义域名 (Cloudflare)

1. 添加域 `www.faroai.net` 到 Cloudflare
2. DNS 设置：
   ```
   Type: A   Name: @   Content: 185.199.108.153
   Type: A   Name: @   Content: 185.199.109.153
   Type: A   Name: @   Content: 185.199.110.153
   Type: A   Name: @   Content: 185.199.111.153
   Type: CNAME Name: www   Content: zhuweifaro-coder.github.io
   ```
   **注意**: Proxy 状态选择 "DNS only" (灰色云朵)

3. 在 GitHub Pages 设置中添加自定义域名

详见 [DEPLOY.md](./DEPLOY.md)

## 📁 项目结构

```
my-website/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions 部署
├── dist/                 # 构建输出
├── src/
│   ├── App.vue          # 主应用组件
│   ├── main.js          # 入口文件
│   └── style.css        # 自定义样式
├── index.html           # 根 HTML
├── package.json         # 依赖管理
├── vite.config.js       # Vite 配置
├── deploy.sh            # 部署脚本
├── setup-git.sh         # Git 配置脚本
├── DEPLOY.md           # 详细部署文档
└── README.md           # 本文件
```

## 🔧 开发指南

### 修改内容

主要编辑 `src/App.vue` 文件修改页面内容和样式。

### 添加新页面

```bash
# 创建新页面组件
mkdir -p src/views
touch src/views/About.vue

# 在 App.vue 中添加路由
```

### 性能优化

- 图片懒加载
- 代码分割
- 资源预加载
- CDN 加速

## 📞 联系

- 🌐 网站：https://www.faroai.net
- 📧 邮箱：contact@faroai.net
- 🐙 GitHub: https://github.com/zhuweifaro-coder

## 📄 License

MIT License

---

**Made with ❤️ by FaroAI Team**
