#!/bin/bash
# 🔧 环境变量配置脚本

echo "📧 FarOAI Email System - 环境变量配置"
echo "====================================="

# 检查 wrangler 是否安装
if ! command -v wrangler &> /dev/null; then
    echo "❌ wrangler 未安装，请先运行: npm install"
    exit 1
fi

echo ""
echo "✅ 检查通过，开始设置环境变量..."
echo ""

# 设置 API Key
if [ -z "$1" ]; then
    echo "请输入 Resend 或 SendGrid API Key:"
    read -sp "API Key: " API_KEY
    echo ""
else
    API_KEY=$1
fi

echo ""
echo "选择邮件服务:"
echo "1) Resend (推荐)"
echo "2) SendGrid"
read -p "选择 (1/2): " SERVICE

if [ "$SERVICE" = "1" ]; then
    echo "设置 RESEND_API_KEY..."
    echo "$API_KEY" | wrangler secret put RESEND_API_KEY
else
    echo "设置 SENDGRID_API_KEY..."
    echo "$API_KEY" | wrangler secret put SENDGRID_API_KEY
fi

echo ""
read -p "请输入微信 Webhook URL: " WEBHOOK_URL
echo "$WEBHOOK_URL" | wrangler secret put WECHAT_WEBHOOK_URL

echo ""
echo "✅ 环境变量设置完成!"
echo ""
echo "部署 Worker: npx wrangler deploy"
echo "查看日志：npx wrangler tail"
