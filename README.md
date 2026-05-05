# FaroAI - 下一代 AI 助手平台

## 🎉 项目介绍

这是一个模仿 OpenClaw.ai 风格构建的现代化 AI 助手平台网站。

## 📦 文件结构

```
faroai/
├── index.html                # 主页 (https://www.faroai.net/)
├── blog.html                 # 博客页 (https://www.faroai.net/blog.html)
├── styles.css                # 全站共用样式
├── blog.css                  # 博客专属样式
├── script.js                 # 主页交互
├── blog.js                   # 博客交互
├── 个人概况_2026_v3.html     # 个人简历附件页
├── deploy-to-cloudflare.sh   # Cloudflare Pages 部署脚本
├── deploy.sh                 # Git push 辅助
├── CLAUDE.md                 # ★ AI 助手操作手册（必读）
└── README.md                 # 项目说明
```

> ⚠️ **AI Agent 注意**：修改本项目前请先读 [CLAUDE.md](./CLAUDE.md)
> —— 那里有"博客 vs 主页"的明确路径映射规则，避免误改。

## 🚀 快速开始

### 本地预览

```bash
cd /Users/clawclaw/openclaw-clone
python3 -m http.server 8080
```

然后访问：`http://localhost:8080`

## ✨ 网站特性

- 🎨 **现代响应式设计** - 完美适配所有设备
- 🌙 **深色/浅色主题** - 自动/手动切换
- ⚡ **流畅动画** - 提升用户体验
- 📱 **移动端优化** - 汉堡菜单交互
- 🎯 **SEO 友好** - 语义化 HTML 结构

## 📋 页面结构

- **头部导航** - Logo、品牌标识、导航链接
- **Hero 区域** - 引人注目的标题和 CTA
- **特性介绍** - 6 个核心功能卡片
- **使用场景** - 4 个应用场景
- **定价方案** - 3 个定价层级
- **页脚** - 品牌信息和社交链接

## 🎨 设计亮点

- **主色调**: Indigo #6366f1
- **字体**: Inter 现代无衬线字体
- **布局**: CSS Grid + Flexbox
- **动画**: 淡入、悬停效果

## 📊 部署状态

- **域名**: faroai.net
- **平台**: Cloudflare Pages
- **状态**: 🚀 已部署上线

---

**创建时间**: 2026-03-28  
**版本**: 1.0.0
