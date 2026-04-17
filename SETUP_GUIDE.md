# 🚀 FarOAI Email System - 完整部署指南

## 📋 任务清单

- [ ] 1. 获取邮件服务 API Key（Resend 或 SendGrid）
- [ ] 2. 在 Cloudflare 设置域名 DNS
- [ ] 3. 在 Cloudflare 配置 Email Routing
- [ ] 4. 设置 Worker 环境变量
- [ ] 5. 部署 Worker
- [ ] 6. 测试邮件收发

---

## 1️⃣ 获取邮件服务 API Key

### 推荐：Resend（最简单）

1. 访问 https://resend.com
2. 注册账号（GitHub 登录即可）
3. 前往 API Keys 页面
4. 创建新的 API Key
5. **复制并保存**（只显示一次）

### 备选：SendGrid

1. 访问 https://sendgrid.com
2. 注册账号
3. Settings → API Keys → Create API Key
4. 复制并保存

---

## 2️⃣ Cloudflare 域名配置

### DNS 记录（用于发件人验证）

在 Cloudflare Dashboard → DNS → Add Record:

| Type | Name | Content | TTL | Proxied |
|------|------|---------|-----|---------|
| TXT | @ | `v=spf1 include:resend.com ~all` | Auto | ❌ |
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:dmarc@faroai.net` | Auto | ❌ |

### DKIM 设置（在发送第一封邮件后获取）

Resend 会提供 DKIM 记录，添加到 DNS:

```
Type: TXT
Name: _resend._domainkey
Content: (Resend 提供的 DKIM 值)
```

---

## 3️⃣ Cloudflare Email Routing 配置

1. 访问 https://dash.cloudflare.com/YOUR_DOMAIN/email/routing
2. 点击 **Enable** 启用 Email Routing
3. 点击 **Add Route**
4. 配置:
   - **To**: `*@faroai.net`
   - **Forward to**: `https://faroai-email.YOUR_ACCOUNT_ID.workers.dev/receipt`
5. 保存

---

## 4️⃣ 设置环境变量

### 方式 A: 交互式脚本

```bash
cd /Users/fastudio/.openclaw/workspace/faroai-email-system
./setup-env.sh YOUR_API_KEY
```

### 方式 B: 手动设置

```bash
# Resend API Key
echo "YOUR_RESEND_API_KEY" | npx wrangler secret put RESEND_API_KEY

# 微信 Webhook（需要获取你的 OpenClaw 配置）
echo "YOUR_WEBHOOK_URL" | npx wrangler secret put WECHAT_WEBHOOK_URL
```

---

## 5️⃣ 部署 Worker

```bash
# 本地测试
npx wrangler dev

# 部署到生产
npx wrangler deploy
```

部署后会获得 URL: `https://faroai-email.YOUR_ACCOUNT_ID.workers.dev`

### 绑定自定义域名（可选）

```bash
# 在 Cloudflare Dashboard → Workers → Routes 添加:
# Route: faroai.net/api/*
# Service: faroai-email
```

---

## 6️⃣ 测试

### 测试发送

```bash
curl -X POST https://faroai-email.YOUR_ACCOUNT_ID.workers.dev/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "👋 测试邮件",
    "text": "这是一封来自 FarOAI 系统的测试邮件"
  }'
```

### 测试接收

发送一封邮件到 `任意地址@faroai.net`，查看微信是否收到通知。

### 查看日志

```bash
npx wrangler tail
```

---

## 🔔 获取微信 Webhook URL

### 方式 1: OpenClaw Gateway

```bash
# 查看网关配置
openclaw gateway status

# 查看通道配置
openclaw config show
```

### 方式 2: 直接从 OpenClaw 获取

如果 OpenClaw 支持 Webhook 模式，需要在 `worker.js` 中直接调用 OpenClaw 消息工具。

---

## 📝 常见问题

### ❓ 邮件发送失败？

1. 检查 API Key 是否正确设置
2. 确认 DNS 记录已生效（SPF/DKIM）
3. 查看 Worker 日志

```bash
npx wrangler tail
```

### ❓ 收件没有推送？

1. 检查 Email Routing 是否启用
2. 确认 Worker `/receipt` 路径可访问
3. 检查 Webhook URL 是否正确

### ❓ 垃圾邮件问题？

新 IP 需要预热：
- 开始每天发送少量邮件（10-20 封）
- 逐渐增加发送量
- 确保邮件内容不含垃圾邮件特征

---

## 🎯 下一步

- [ ] 创建邮件管理 Web 界面
- [ ] 添加附件支持
- [ ] 实现邮件搜索存档
- [ ] 添加 SMTP 服务器（完整收件）

---

## 📞 支持

遇到问题？查看:
- Worker 日志: `npx wrangler tail`
- Email Routing 日志: Cloudflare Dashboard → Email → Logs
- 创建 GitHub Issue
