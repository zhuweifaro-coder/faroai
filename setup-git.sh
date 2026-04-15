#!/bin/bash

# GitHub 初始配置脚本

set -e

echo "🔧 GitHub 仓库初始配置"
echo "========================"

# 配置信息
GITHUB_USER="zhuweifaro-coder"
REPO_NAME="faroai"
SSH_KEY_comment="clawclaw@faMac.local"

# 检查 Git 配置
echo -e "\n📋 检查 Git 配置..."
if ! git config user.name; then
    echo -e "⚠️  需要配置 Git 用户信息"
    read -p "请输入你的名字：" GIT_NAME
    read -p "请输入你的邮箱：" GIT_EMAIL
    git config user.name "$GIT_NAME"
    git config user.email "$GIT_EMAIL"
    echo -e "✅ Git 用户已配置"
else
    echo -e "✅ Git 已配置: $(git config user.name) <$(git config user.email)>"
fi

# 检查 SSH 密钥
echo -e "\n🔑 检查 SSH 密钥..."
if [ -f ~/.ssh/id_rsa.pub ]; then
    echo -e "✅ 找到 SSH 公钥: ~/.ssh/id_rsa.pub"
    echo "公钥内容:"
    cat ~/.ssh/id_rsa.pub
    echo ""
    echo -e "ℹ️  请访问 https://github.com/settings/ssh 添加此公钥"
else
    echo -e "⚠️  未找到 SSH 密钥"
    echo "请运行命令生成密钥:"
    echo "  ssh-keygen -t rsa -b 4096 -C \"$SSH_KEY_comment\""
    echo "  cat ~/.ssh/id_rsa.pub"
fi

# 检查并添加远程仓库
echo -e "\n🔗 配置 GitHub 远程仓库..."
if ! git remote get-url origin 2>/dev/null; then
    echo -e "🏗️  添加远程仓库: $GITHUB_USER/$REPO_NAME"
    git remote add origin git@github.com:$GITHUB_USER/$REPO_NAME.git
    echo -e "✅ 远程仓库已添加"
else
    echo -e "✅ 远程仓库已存在: $(git remote get-url origin)"
fi

# 测试 SSH 连接
echo -e "\n🧪 测试 GitHub SSH 连接..."
if ssh -T git@github.com 2>&1 | grep -q "authenticated"; then
    echo -e "✅ SSH 连接正常"
else
    echo -e "⚠️  SSH 连接可能有问题，请确保:
    1. SSH 密钥已添加到 GitHub 账户
    2. 使用正确的 SSH 密钥"
fi

# 显示当前状态
echo -e "\n📊 当前仓库状态:"
git status --short || echo "仓库尚未初始化"

echo -e "\n========================"
echo -e "✅ 配置完成!"
echo ""
echo "📝 下一步:"
echo "1. 如果仓库未创建，请先在 GitHub 创建: $GITHUB_USER/$REPO_NAME"
echo "2. 提交代码：git add . && git commit -m 'Initial commit'"
echo "3. 首次推送：git push -u origin main"
echo ""
