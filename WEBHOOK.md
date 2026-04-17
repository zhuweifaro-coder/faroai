# 微信 Webhook 配置指南

## 获取 Webhook URL

### 方式 1：OpenClaw 内建 Webhook

如果你使用的是 OpenClaw 的本地服务，可以通过以下方式获取 Webhook：

```bash
# 查看当前配置
openclaw config show

# 或使用消息工具测试
```

### 方式 2：使用第三方 Webhook 服务

1. **Webhook.site** (测试用)
   - 访问 https://webhook.site
   - 复制你的唯一 URL

2. **ngrok** (本地开发)
   ```bash
   ngrok http 3000
   ```

## 测试 Webhook

```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{"message": "测试消息"}'
```

## OpenClaw 集成

如果使用 OpenClaw 的消息工具，需要确保:

1. `openclaw-weixin` 通道已配置
2. Webhook URL 指向 OpenClaw 网关
3. 正确的 `accountId` 和 `to` 参数

## 示例配置

```javascript
// worker.js 中的发送逻辑
await sendWeChatNotification(env, message);

// 内部实现
async function sendWeChatNotification(env, message) {
  await fetch(env.WECHAT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
}
```
