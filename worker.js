// 📧 FarOAI Email System
// Cloudflare Worker + 邮件系统集成

// ⚠️ 重要：Worker 无法访问 localhost:18789（本地网关）
// 解决方案：使用外部 webhook 服务（钉钉/飞书/Telegram/n8n）

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 处理邮件发送请求
    if (url.pathname === '/send' && request.method === 'POST') {
      return handleSendEmail(request, env);
    }
    
    // 处理 Email Routing webhook
    if (url.pathname === '/receipt' && request.method === 'POST') {
      return handleReceivedEmail(request, env);
    }
    
    // 健康检查
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'faroai-email' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('FaroAI Email Service\n\n✅ 运行正常\n\n可用端点:\n- POST /send - 发送邮件\n- POST /receipt - 接收邮件\n- GET /health - 健康检查', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ========== 发送邮件 ==========
async function handleSendEmail(request, env) {
  try {
    const { to, subject, html, text } = await request.json();
    
    if (!to || !subject) {
      return jsonError('缺少必要参数：to, subject');
    }
    
    // 使用 Resend/SendGrid 发送
    const apiKey = env.RESEND_API_KEY || env.SENDGRID_API_KEY;
    const service = env.RESEND_API_KEY ? 'resend' : 'sendgrid';
    
    if (!apiKey) {
      return jsonError('未配置邮件服务 API Key（RESEND_API_KEY 或 SENDGRID_API_KEY）');
    }
    
    let response;
    if (service === 'resend') {
      response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'FaroAI <noreply@faroai.net>',
          to: [to],
          subject,
          html,
          text
        })
      });
    } else {
      response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: 'noreply@faroai.net', name: 'FaroAI' },
          subject,
          content: [{ type: 'text/plain', value: text || subject }]
        })
      });
    }
    
    if (!response.ok) {
      const err = await response.text();
      return jsonError(`邮件发送失败：${err}`);
    }
    
    // 发送成功后，通知 webhook
    const notifyMsg = `✅ 邮件已发送\n📧 收件人：${to}\n📝 主题：${subject}`;
    await sendNotification(env, notifyMsg);
    
    return jsonSuccess({ message: 'Email sent successfully' });
  } catch (error) {
    return jsonError(`发送失败：${error.message}`);
  }
}

// ========== 接收邮件（Webhook） ==========
async function handleReceivedEmail(request, env) {
  try {
    // Cloudflare Email Routing webhook 格式
    const data = await request.json();
    
    const {
      sender,
      recipients,
      subject,
      raw_message,
      headers
    } = data;
    
    // 转发邮件内容到 webhook
    const message = `📬 新邮件到达\n\n👤 发件人：${sender}\n📧 收件人：${recipients}\n📝 主题：${subject}\n\n${formatMailPreview(raw_message)}`;
    await sendNotification(env, message);
    
    return new Response('Email received and forwarded', { status: 200 });
  } catch (error) {
    console.error('Email receipt error:', error);
    return jsonError(`接收失败：${error.message}`);
  }
}

// ========== 发送通知 ==========
async function sendNotification(env, message) {
  try {
    // Worker 无法访问 localhost，使用外部 webhook
    if (env.WEBHOOK_URL) {
      await fetch(env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
      console.log('Notification sent to webhook');
    } else {
      // 记录但不发送（因为没有配置 webhook）
      console.log('[Notification logged]:', message);
    }
  } catch (error) {
    console.error('Notification failed:', error);
  }
}

// ========== 工具函数 ==========
function formatMailPreview(rawMessage) {
  // 简化邮件内容预览
  const bodyMatch = rawMessage.match(/Content-Body:([\s\S]*)/);
  if (bodyMatch) {
    return bodyMatch[1].substring(0, 500) + (bodyMatch[1].length > 500 ? '\n...' : '');
  }
  return rawMessage.substring(0, 300);
}

function jsonSuccess(data) {
  return new Response(JSON.stringify({ success: true, ...data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

function jsonError(message) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
