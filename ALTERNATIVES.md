# 🔔 通知方案对比

## ⚠️ 核心限制

**Cloudflare Worker 无法访问 `localhost:18789`**（你的本地 OpenClaw 网关）

## 📋 可选方案

### 方案 A：钉钉 Webhook（推荐，国内可用）

**优点**：
- ✅ 国内访问快
- ✅ 免费
- ✅ 设置简单

**缺点**：
- ❌ 不是微信

**设置步骤**：
1. 创建钉钉群
2. 群设置 → 机器人 → 添加「自定义机器人」
3. 获取 Webhook URL
4. 添加到 Worker 环境变量：

```bash
echo "https://oapi.dingtalk.com/robot/send?access_token=xxx" | npx wrangler secret put WEBHOOK_URL
```

---

### 方案 B：飞书 Webhook

**优点**：
- ✅ 企业级
- ✅ 界面美观
- ✅ 支持富文本

**设置步骤**：
1. 创建飞书群
2. 添加「自定义 Webhook 机器人」
3. 获取 Webhook URL

```bash
echo "https://open.feishu.cn/open-apis/bot/v2/hook/xxx" | npx wrangler secret put WEBHOOK_URL
```

---

### 方案 C：Telegram Bot

**优点**：
- ✅ 全球可用
- ✅ 支持丰富功能

**设置步骤**：
1. 在 Telegram 联系 @BotFather
2. 创建新 Bot，获取 Token
3. 使用 Webhook 模式

```bash
# 设置 Telegram Bot Token
echo "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" | npx wrangler secret put TELEGRAM_BOT_TOKEN

# 在 Telegram 获取你的 Chat ID
```

---

### 方案 D：n8n 自建中转（最灵活）

**方案**：
1. 在 VPS/服务器上部署 n8n
2. n8n 接收 Cloudflare Worker 的 webhook
3. n8n 转发到任意渠道（包括调用本地 OpenClaw 网关）

**优点**：
- ✅ 完全控制
- ✅ 支持复杂逻辑
- ✅ 可以转发到微信（如果 OpenClaw 网关可被 n8n 访问）

**缺点**：
- ❌ 需要额外的服务器

---

### 方案 E：邮件转发到邮箱（替代微信）

直接接收邮件到你的个人邮箱，而不是推送微信。

1. 配置 Email Routing 转发到 Gmail/QQ 邮箱
2. 设置 Gmail 自动分类

**优点**：
- ✅ 最简单
- ✅ 完全免费
- ✅ 不需要 Worker 处理

**缺点**：
- ❌ 不是微信提醒

---

### 方案 F：使用 Serverless 中转（如：Vercel/Netlify）

1. 在 Vercel 部署一个 Node.js 服务
2. 该服务接收 Cloudflare Worker 的请求
3. Vercel 服务可以调用本地网关（通过内网穿透如 ngrok）

---

## 🎯 我的推荐组合

### 日常使用（快速上线）
**Resend（发邮件） + 钉钉/飞书 Webhook（收通知）**

```bash
# 设置环境变量
echo "re_xxx" | npx wrangler secret put RESEND_API_KEY
echo "https://oapi.dingtalk.com/robot/send?access_token=xxx" | npx wrangler secret put WEBHOOK_URL

# 部署
npx wrangler deploy
```

### 完全集成（技术可行但复杂）
**自建 n8n 服务 + 内网穿透**

1. 云服务器部署 n8n
2. n8n 暴露 Webhook 给 Worker
3. n8n 通过 ngrok 连接本地 OpenClaw 网关
4. Worker → n8n → ngrok → localhost:18789

---

## 📝 当前 Worker 支持渠道

修改 `sendNotification()` 函数即可支持不同渠道：

```javascript
// 钉钉
await fetch(`https://oapi.dingtalk.com/robot/send?access_token=${env.DINGTALK_TOKEN}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    msgtype: 'text',
    text: { content: message }
  })
});

// 飞书
await fetch(`https://open.feishu.cn/open-apis/bot/v2/hook/${env.FEISHU_TOKEN}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: { content: message } })
});

// 自定义 Webhook
await fetch(env.WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: message })
});
```

---

## ❓ 常见问题

**Q: 为什么不能直接调用 OpenClaw 网关？**

A: Cloudflare Worker 运行在 Cloudflare 的全球边缘网络上，无法访问你的本地网络（localhost/127.0.0.1）。这是安全隔离机制。

**Q: 有没有办法绕过去？**

A: 
1. 内网穿透（ngrok/frp）→ 暴露在公网
2. 在云端部署中转服务（n8n/zapier）
3. 使用第三方 webhook 服务

**Q: 推荐哪个方案？**

A: 如果你只需要邮件通知：
- **发邮件**：Resend（简单、免费额度够用）
- **收通知**：钉钉/飞书（国内方便）或 QQ/飞书邮箱

如果你一定要微信推送：
- 需要自建中转服务（n8n + 内网穿透）

---

## 🚀 下一步行动

1. [ ] 选择通知渠道（推荐：钉钉或飞书）
2. [ ] 获取 Webhook URL
3. [ ] 设置环境变量
4. [ ] 部署 Worker
5. [ ] 测试邮件发送
6. [ ] 配置 Email Routing 接收邮件

需要我帮你创建钉钉/飞书 Webhook 的配置脚本吗？
