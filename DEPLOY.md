# 部署到 GitHub Pages + Cloudflare

## 📋 环境信息

- **GitHub 用户**: zhuweifaro-coder
- **仓库**: zhuweifaro-coder/faroai
- **域名**: www.faroai.net
- **SSH Key**: 已配置

## 🔐 安全提示

⚠️ **重要**：请妥善保管以下信息：
- GitHub Token（已泄露，建议立即撤销并生成新 token）
- GitHub 密码
- SSH 私钥

## 🚀 部署步骤

### 1️⃣ 配置 Git

```bash
cd /Users/fastudio/.openclaw/workspace/my-website

# 配置用户信息
git config user.name "zhuweifaro-coder"
git config user.email "your-email@example.com"

# 添加远程仓库
git remote add origin git@github.com:zhuweifaro-coder/faroai.git

# 验证 SSH 连接
ssh -T git@github.com
```

### 2️⃣ 初始化仓库

```bash
# 初始化 git（如果尚未初始化）
git init

# 添加所有文件
git add .

# 初始提交
git commit -m "Initial commit: FaroAI Website"

# 推送到 GitHub（如果仓库已存在）
git push -u origin main
```

### 3️⃣ 创建 GitHub Pages 分支

```bash
# 创建 dist 目录（先构建）
npm run build

# 创建 gh-pages 分支
git checkout -b gh-pages
git clean -fd

# 复制 dist 内容到 gh-pages
cp -r dist/* .
rm -rf dist src node_modules *.lock

# 提交并推送
git add .
git commit -m "Deploy to GitHub Pages"
git push -u origin gh-pages
```

### 4️⃣ 启用 GitHub Pages

1. 进入 GitHub 仓库设置
2. Pages → Source → 选择 `gh-pages` 分支
3. 保存，等待几分钟

### 5️⃣ 配置 Cloudflare 域名

1. **登录 Cloudflare 控制台**
2. **添加域**：www.faroai.net
3. **DNS 设置**：
   ```
   Type: A
   Name: @
   Content: 185.199.108.153
   Proxy: DNS only (灰色云朵)
   ```
   ```
   Type: A
   Name: @
   Content: 185.199.109.153
   Proxy: DNS only
   ```
   ```
   Type: A
   Name: @
   Content: 185.199.110.153
   Proxy: DNS only
   ```
   ```
   Type: A
   Name: @
   Content: 185.199.111.153
   Proxy: DNS only
   ```
   ```
   Type: CNAME
   Name: www
   Content: zhuweifaro-coder.github.io
   Proxy: DNS only (灰色云朵)
   ```

4. **GitHub 仓库 Pages 设置**：
   - Custom domain: www.faroai.net
   - Enforce HTTPS: 等待 DNS生效后开启

### 6️⃣ 简化部署脚本

```bash
# 使用部署脚本（创建 deploy.sh）
chmod +x deploy.sh
./deploy.sh
```

## 🔧 更新网站

```bash
# 修改代码
# ...

# 提交并推送主分支
git add .
git commit -m "Update website content"
git push origin main

# 重新构建并部署到 gh-pages
npm run build

# 切换到 gh-pages 分支
git checkout gh-pages
git clean -fd

# 复制新构建的内容
cp -r ../dist/* .

# 提交
git add .
git commit -m "Deploy update"
git push origin gh-pages

# 切换回 main 分支
git checkout main
```

## 📝 自动部署脚本

已创建 `.github/workflows/deploy.yml`，推送主分支后自动构建。

## ⚙️ 环境检查

```bash
# 检查 Git 配置
git config --list

# 检查 SSH 密钥
ls -la ~/.ssh/id_rsa*

# 测试 GitHub 连接
ssh -T git@github.com

# 检查 Node.js 版本
node --version
npm --version
```

## 🔑 生成新的 GitHub Token（建议）

1. 访问：https://github.com/settings/tokens
2. 撤销旧 token `ghp_VkoFIhAdOn2yq3DVmYzKdDHFRAdSl3aW2*`
3. 创建新 token：
   - 有效期：30 天或更长
   - 权限：repo, workflow, pages
4. 保存在安全位置（密码管理器）

---

**完成后访问**：
- GitHub Pages: https://zhuweifaro-coder.github.io/faroai
- 自定义域名：https://www.faroai.net（DNS 生效后）
