# OpenClaw Clone 网站

## 🎉 项目介绍

这是一个模仿 OpenClaw.ai 风格构建的现代化 AI 助手平台网站。

## 📦 文件结构

```
openclaw-clone/
├── index.html           # 主页面
├── styles.css           # CSS 样式文件
├── script.js            # JavaScript 交互
└── README.md            # 项目说明
```

## 🚀 快速开始

### 本地预览

```bash
# 方式 1: Python HTTP 服务器
cd /Users/clawclaw/openclaw-clone
python3 -m http.server 8080

# 方式 2: Node.js Live Server
npm install -g live-server
live-server --port=8080
```

然后访问：`http://localhost:8080`

### 部署

#### GitHub Pages
1. 创建 GitHub 仓库
2. 推送代码
3. 启用 GitHub Pages 设置

#### Vercel
```bash
npm install -g vercel
vercel
```

## ✨ 网站特性

- 🎨 **现代响应式设计** - 完美适配所有设备
- 🌙 **深色/浅色主题** - 自动/手动切换
- ⚡ **流畅动画** - 提升用户体验
- 📱 **移动端优化** - 汉堡菜单交互
- 🎯 **SEO 友好** - 语义化 HTML 结构
- 🚀 **高性能** - 零第三方依赖

## 📋 页面结构

### 头部导航
- Logo 和品牌标识
- 主导航链接
- 登录/开始按钮
- 移动端菜单

### Hero 区域
- 引人注目的标题和副标题
- CTA 按钮
- 统计数据展示
- Dashboard 预览

### 特性介绍
- 6 个核心特性卡片
- 图标和描述
- 悬停动画效果

### 使用场景
- 4 个应用场景卡片
- 直观图标展示
- 简洁描述

### 定价方案
- 3 个定价层级
- 特色高亮
- 功能对比列表

### 页脚
- 品牌信息
- 社交链接
- 快速导航
- 订阅表单

## 🎨 设计亮点

### 色彩方案
- **主色调**: #6366f1 (Indigo)
- **辅助色**: #0ea5e9 (Sky)
- **强调色**: #8b5cf6 (Purple)
- **中性色**: Slate 色系

### 排版系统
- **标题**: Inter 字体，800 粗体
- **正文**: 16px，1.6 行高
- **响应式**: 断点 1024px/768px/480px

### 动画效果
- 淡入向上动画
- 悬停效果
- 平滑滚动
- 计数动画

## 🔧 自定义建议

### 修改品牌信息
编辑 `index.html` 中的 Logo 和描述

### 更新定价
修改 `pricing-grid` 部分的 HTML

### 添加更多内容
在相应 section 中添加新的卡片

### 自定义主题
编辑 `styles.css` 中的 CSS 变量

## 📚 技术栈

- **HTML5** - 语义化结构
- **CSS3** - Flexbox, Grid, 动画
- **JavaScript** - ES6+，原生实现
- **无框架** - 零依赖，轻量级

## 📊 性能优化

### 已完成
- ✅ 最小化 CSS
- ✅ 优化图片加载
- ✅ 无第三方资源

### 建议添加
- [ ] 图片 WebP 格式
- [ ] Gzip 压缩
- [ ] CDN 加速
- [ ] 缓存策略

## 🎯 下一步

### 立即行动
1. ✅ 本地预览和测试
2. ✅ 修改品牌和文案
3. ✅ 准备部署
4. ✅ 购买域名

### 功能扩展
- [ ] 添加博客系统
- [ ] 集成联系表单
- [ ] 添加更多页面
- [ ] 集成分析工具

## 📄 许可证

MIT License - 自由使用和修改

## 🙏 致谢

受 OpenClaw.ai 网站启发，但采用完全原创的设计实现。

---

**创建时间**: 2026-03-28  
**版本**: 1.0.0
