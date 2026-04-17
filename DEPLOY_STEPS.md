# 🚀 FarOAI Email System 部署步骤

## 1️⃣ 登录 Cloudflare

```bash
cd /Users/fastudio/.openclaw/workspace/faroai-email-system
npx wrangler login
```

**提示**：
- 浏览器会打开 Cloudflare 登录页面
- 登录后授权返回

## 2️⃣ 获取邮件服务 API Key

### 选择 Resend（推荐）

1. 访问 https://resend.com
2. 用 GitHub 账号登录
3. 前往 **API Keys** 页面
4. 点击 **Create API Key**
5. 复制完整的 API Key（格式：`re_xxxxxxxxxxxxxx`）

### 或 SendGrid

1. 访问 https://sendgrid.com
2. 注册账号
3. Settings → API Keys → Create API Key

## 3️⃣ 设置环境变量

```bash
# 替换为你的 Resend API Key
echo "re_xxxxxxxxxxxxxx" | npx wrangler secret put RESEND_API_KEY

# 可选：设置 Webhook URL（用于接收通知）
# 钉钉示例：
# echo "https://oapi.dingtalk.com/robot/send?access_token=xxx" | npx wrangler secret put WEBHOOK_URL
```

## 4️⃣ 部署 Worker

```bash
npx wrangler deploy
```

部署成功后，你会获得 Worker URL:
```
https://faroai-email.<你的账户 ID>.workers.dev
```

## 5️⃣ 配置 Cloudflare Email Routing

1. 访问 https://dash.cloudflare.com/YOUR_DOMAIN/email/routing
2. 点击 **Enable Email Routing**
3. 选择 **Custom Address**
4. 配置:
   - **To**: `*@faroai.net`
   - **Forward to**: `https://faroai-email.<账户 ID>.workers.dev/receipt`
5. 保存

## 6️⃣ 测试发送邮件

```bash
curl -X POST https://faroai-email.<账户 ID>.workers.dev/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "👋 测试邮件",
    "text": "这是一封来自 FarOAI 系统的测试邮件"
  }'
```

## 7️⃣ 查看日志

```bash
npx wrangler tail
```

---

## 常见问题

### ❓ 登录失败？
- 检查网络连接
- 重新运行 `npx wrangler login`

### ❓ Token 无效？
- 在 Cloudflare Dashboard → 我的个人资料 → API Tokens 创建新的
- 确保权限包括：Account、Workers、Email Routing

### ❓ 邮件发送失败？
- 检查 Resend/SendGrid API Key 是否正确
- 查看 Worker 日志：`npx wrangler tail`

---

## 下一步

部署完成后：
- [ ] 配置 Email Routing
- [ ] 设置 Webhook 通知
- [ ] 测试发送邮件
- [ ] 测试接收邮件推送

---

*最后更新：2026-04-17*
