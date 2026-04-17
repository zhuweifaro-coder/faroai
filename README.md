# 📧 FarOAI Email System

通过微信机器人收发邮件的完整解决方案

## 🏗️ 架构

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  外部邮箱    │ ──► │ Cloudflare   │ ──► │  微信机器人  │
│  (收件)     │     │ Email Routing│     │             │
└─────────────┘     └──────────────┘     └─────────────┘
                          
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Webhook    │ ──► │ Cloudflare   │ ──► │ 第三方 SMTP  │
│  (API 调用)  │     │   Worker     │     │ (Resend/SG) │
└─────────────┘     └──────────────┘     └─────────────┘
```

## 📋 前置要求

1. **Cloudflare 账号** + 域名 `faroai.net`
2. **邮件发送服务**（二选一）:
   - [Resend](https://resend.com) - 推荐，简单好用
   - [SendGrid](https://sendgrid.com)
3. **微信 Webhook**（OpenClaw 内建支持）

## 🚀 快速开始

### 1. 安装依赖

```bash
cd faroai-email-system
npm install
```

### 2. 设置环境变量

```bash
# Resend API Key（推荐）
npx wrangler secret put RESEND_API_KEY

# 或 SendGrid API Key
npx wrangler secret put SENDGRID_API_KEY

# 微信 Webhook URL
npx wrangler secret put WECHAT_WEBHOOK_URL
```

### 3. 部署

```bash
npx wrangler deploy
```

### 4. 配置 Cloudflare Email Routing

1. 访问 Cloudflare Dashboard → Email → Routes
2. 添加 Route:
   - **To**: `*@faroai.net`
   - **Forward to**: `https://faroai-email.<your-account>.workers.dev/receipt`

### 5. 绑定域名（可选）

```bash
npx wrangler routes add faroai.net/api/email/* https://faroai-email.<your-account>.workers.dev
```

## 📬 使用方式

### 发送邮件

```bash
curl -X POST https://faroai-email.<your-account>.workers.dev/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "测试邮件",
    "text": "这是一封测试邮件"
  }'
```

### 接收邮件

配置 Email Routing 后，所有发送到 `*@faroai.net` 的邮件会自动转发到 Worker，并推送至微信。

## 🔑 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `RESEND_API_KEY` | Resend API 密钥 | `re_xxxxxxxxx` |
| `SENDGRID_API_KEY` | SendGrid API 密钥 | `SG.xxxxxxxxx` |
| `WECHAT_WEBHOOK_URL` | 微信 Webhook URL | `https://...` |

## 🛡️ 安全提醒

⚠️ **不要将 API Key 提交到代码仓库！**

- 使用 `wrangler secret` 设置敏感信息
- 添加 `.dev.vars` 到 `.gitignore`
- 定期轮换 API 密钥

## 📊 费用估算

- **Cloudflare Workers**: 免费套餐 100,000 请求/天
- **Resend**: 免费套餐 100 邮件/天
- **Cloudflare Email Routing**: 完全免费

## 🔄 后续优化

- [ ] 添加邮件附件支持
- [ ] 实现邮件模板系统
- [ ] 添加垃圾邮件过滤
- [ ] 支持多个发件人地址
- [ ] 邮件队列管理

## 📝 故障排查

### 邮件发送失败
1. 检查 API Key 是否正确设置
2. 确认域名 DNS 记录正确
3. 查看 Worker 日志: `npx wrangler tail`

### 收件未收到
1. 检查 Email Routing 配置
2. 确认 Worker receipt 路径可访问
3. 查看 Worker 日志

---

Created by FarOAI 🦾
