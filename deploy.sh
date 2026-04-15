#!/bin/bash

# FaroAI Website 部署脚本

set -e

echo "🚀 FaroAI 网站部署开始..."

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js: $(node --version)${NC}"

# 检查是否已初始化 git
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}⚠️  初始化 Git 仓库...${NC}"
    git init
fi

# 构建项目
echo -e "${YELLOW}🔨 构建项目...${NC}"
npm run build

# 检查是否有 dist 目录
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ 构建失败，dist 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 构建完成${NC}"

# 配置 gh-pages 分支
echo -e "${YELLOW}📦 配置部署分支...${NC}"

# 保存当前分支
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

# 切换/创建 gh-pages 分支
git checkout gh-pages 2>/dev/null || git checkout -b gh-pages

# 清理旧文件
git clean -fd
git reset --hard HEAD 2>/dev/null || true

# 复制新构建的内容
cp -r ../dist/* .
cp -r ../dist/.* . 2>/dev/null || true

# 添加并提交
git add .
if git diff --cached --quiet; then
    echo -e "${GREEN}✓ 没有新内容需要提交${NC}"
else
    git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${GREEN}✓ 提交完成${NC}"
fi

# 恢复原分支
git checkout $CURRENT_BRANCH

echo -e "${GREEN}✅ 部署准备完成!${NC}"
echo ""
echo -e "${YELLOW}📝 下一步操作：${NC}"
echo "1. 确认仓库已创建：https://github.com/zhuweifaro-coder/faroai"
echo "2. 推送代码：git push -u origin main"
echo "3. 推送 gh-pages: git push -u origin gh-pages"
echo "4. 在仓库设置中启用 GitHub Pages（选择 gh-pages 分支）"
echo ""
echo -e "${YELLOW}🌐 完成后访问：${NC}"
echo "   - GitHub Pages: https://zhuweifaro-coder.github.io/faroai"
echo "   - 自定义域名：https://www.faroai.net (需要 Cloudflare 配置)"
