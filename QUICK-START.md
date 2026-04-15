# 🚀 快速部署指南

## 环境信息

| 项目 | 值 |
|------|-----|
| **GitHub 用户** | `zhuweifaro-coder` |
| **仓库名称** | `faroai` |
| **定制域名** | `www.faroai.net` |
| **SSH Key** | 已配置在 `clawclaw@faMac.local` |

---

## ⚡ 10 分钟部署流程

### 1️⃣ 在 GitHub 创建仓库（2 分钟）

1. 访问：https://github.com/new
2. 仓库名：`faroai`
3. 类型：Private（推荐）或 Public
4. 不要勾选 "Initialize this repository"
5. 点击 "Create repository"

### 2️⃣ 配置本地 Git（2 分钟）

```bash
cd /Users/fastudio/.openclaw/workspace/my-website

# 运行配置脚本
./setup-git.sh

# 手动配置（如果脚本失败）
git config user.name "zhuweifaro-coder"
git config user.email "your-email@example.com"

# 添加远程仓库
git remote add origin git@github.com:zhuweifaro-coder/faroai.git
```

### 3️⃣ 首次推送代码（1 分钟）

```bash
# 提交所有文件
git add .
git commit -m "Initial commit: FaroAI Website"

# 推送到主分支
git push -u origin main
```

### 4️⃣ 建立 gh-pages 分支并部署（2 分钟）

```bash
# 运行部署脚本
./deploy.sh

# 推送 gh-pages 分支
git push -u origin gh-pages
```

### 5️⃣ 启用 GitHub Pages（1 分钟）

1. 进入 GitHub 仓库：https://github.com/zhuweifaro-coder/faroai
2. 点击 **Settings** (设置)
3. 左侧菜单选择 **Pages**
4. **Source**: 选择 `gh-pages` 分支
5. 点击 **Save** (保存)
6. 等待 2-3 分钟，页面会自动刷新显示访问地址

### 6️⃣ 配置 Cloudflare 域名（2 分钟）

1. 登录 Cloudflare：https://dash.cloudflare.com
2. 点击 **Add a Domain** → 输入 `www.faroai.net`
3. 等待 DNS 扫描完成
4. 在 DNS 页面添加以下记录：

| Type | Name | Content | Proxy Status |
|------|------|---------|--------------|
| A | @ | 185.199.108.153 | DNS only (灰色) |
| A | @ | 185.199.109.153 | DNS only |
| A | @ | 185.199.110.153 | DNS only |
| A | @ | 185.199.111.153 | DNS only |
| CNAME | www | zhuweifaro-coder.github.io | DNS only (灰色) |

5. 回到 GitHub 仓库 → Settings → Pages
6. **Custom domain**: 输入 `www.faroai.net`
7. 点击 **Save**
8. 等待约 5 分钟后，勾选 **Enforce HTTPS**

---

## ✅ 完成验证

### 访问网站

- GitHub Pages: https://zhuweifaro-coder.github.io/faroai
- 自定义域名：https://www.faroai.net（需 DNS 生效后）

### 检查清单

- [ ] GitHub 仓库已创建
- [ ] `main` 分支已推送代码
- [ ] `gh-pages` 分支已创建并推送
- [ ] GitHub Pages 已启用
- [ ] Cloudflare 域已添加
- [ ] DNS 记录已配置
- [ ] 自定义域名已连接
- [ ] HTTPS 已启用

---

## 🔧 常见问题

### 问题 1: SSH 连接失败

```bash
# 检查 SSH 密钥
cat ~/.ssh/id_rsa.pub

# 将公钥添加到 GitHub: https://github.com/settings/ssh
# 测试连接
ssh -T git@github.com
```

### 问题 2: gh-pages 分支找不到

```bash
# 手动创建 gh-pages 分支
npm run build
git checkout gh-pages
git clean -fd
cp -r ../dist/* .
git add .
git commit -m "Initial Pages deployment"
git push -u origin gh-pages
```

### 问题 3: 域名无法访问

1. 检查 Cloudflare DNS 是否正确配置
2. 等待 DNS 生效（可能需要几分钟到 24 小时）
3. 检查 GitHub Pages Custom domain 设置是否正确
4. 使用 `nslookup www.faroai.net` 检查解析

### 问题 4: HTTPS 无法启用

1. 确保 DNS 已生效
2. 等待 5-30 分钟
3. 确保 Custom domain 已设置
4. 如果仍失败，撤销并重新添加 Custom domain

---

## 🔄 更新网站

### 手动更新

```bash
# 编辑代码
# ...

# 推送到 main 分支
git add .
git commit -m "Update: 描述变更"
git push origin main

# 重新构建并部署
./deploy.sh
git push origin gh-pages
```

### 自动更新（推荐）

配置好 GitHub Actions 后，只需推送到 main 分支，gh-pages 会自动更新。

---

## 📞 获取帮助

遇到问题？检查：

1. [DEPLOY.md](./DEPLOY.md) - 详细部署文档
2. GitHub Issues - 反馈问题
3. 查看浏览器控制台错误信息

---

**🎉 完成! 享受你的现代化网站！**
