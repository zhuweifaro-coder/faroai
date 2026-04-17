// 📧 FarOAI Email System
// Cloudflare Worker + WeChat Integration

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 处理邮件发送请求
    if (url.pathname === '/send' && request.method === 'POST') {
      return handleSendEmail(request, env);
    }
    
    // 处理 Email Routing  webhook
    if (url.pathname === '/receipt' && request.method === 'POST') {
      return handleReceivedEmail(request, env);
    }
    
    // 健康检查
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'faroai-email' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('FaroAI Email Service', { status: 200 });
  }
}

// ========== 发送邮件 ==========
async function handleSendEmail(request, env) {
  try {
    const { to, subject, html, text } = await request.json();
    
    if (!to || !subject) {
      return jsonError('缺少必要参数: to, subject');
    }
    
    // 使用 Resend/SendGrid 发送
    const apiKey = env.RESEND_API_KEY || env.SENDGRID_API_KEY;
    const service = env.RESEND_API_KEY ? 'resend' : 'sendgrid';
    
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
      return jsonError(`邮件发送失败: ${err}`);
    }
    
    // 发送成功后，通知微信
    await sendWeChatNotification(env, `✅ 邮件已发送\n📧 收件人: ${to}\n📝 主题: ${subject}`);
    
    return jsonSuccess({ message: 'Email sent successfully' });
  } catch (error) {
    return jsonError(`发送失败: ${error.message}`);
  }
}

// ========== 接收邮件（Webhook） ==========
async function handleReceivedEmail(request, env) {
  try {
    // Cloudflare Email Routing webhook格式
    const data = await request.json();
    
    const {
      sender,
      recipients,
      subject,
      raw_message,
      headers
    } = data;
    
    // 转发邮件内容到微信
    const message = `📬 新邮件到达\n\n👤 发件人：${sender}\n📧 收件人：${recipients}\n📝 主题：${subject}\n\n${formatMailPreview(raw_message)}`;
    
    await sendWeChatNotification(env, message);
    
    return new Response('Email received and forwarded to WeChat', { status: 200 });
  } catch (error) {
    console.error('Email receipt error:', error);
    return jsonError(`接收失败: ${error.message}`);
  }
}

// ========== 发送微信通知 ==========
async function sendWeChatNotification(env, message) {
  try {
    const webhookUrl = env.WECHAT_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.log('No WeChat webhook URL configured');
      return;
    }
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    
  } catch (error) {
    console.error('WeChat notification failed:', error);
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
