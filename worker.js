// 📧 FarOAI Email System
// Cloudflare Worker + 邮件系统集成
// ⚠️ Worker 无法访问 localhost:18789，使用外部 webhook

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === '/send' && request.method === 'POST') {
      return handleSendEmail(request, env);
    }
    
    if (url.pathname === '/receipt' && request.method === 'POST') {
      return handleReceivedEmail(request, env);
    }
    
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'faroai-email' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('FaroAI Email Service - Running OK', { status: 200 });
  }
}

async function handleSendEmail(request, env) {
  try {
    const { to, subject, html, text } = await request.json();
    
    if (!to || !subject) {
      return jsonError('缺少必要参数：to, subject');
    }
    
    const apiKey = env.RESEND_API_KEY || env.SENDGRID_API_KEY;
    const service = env.RESEND_API_KEY ? 'resend' : 'sendgrid';
    
    if (!apiKey) {
      return jsonError('未配置邮件服务 API Key');
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
    
    await sendNotification(env, `✅ 邮件已发送\n📧 收件人：${to}\n📝 主题：${subject}`);
    return jsonSuccess({ message: 'Email sent successfully' });
  } catch (error) {
    return jsonError(`发送失败：${error.message}`);
  }
}

async function handleReceivedEmail(request, env) {
  try {
    const data = await request.json();
    const { sender, recipients, subject, raw_message } = data;
    const message = `📬 新邮件到达\n👤 发件人：${sender}\n📝 主题：${subject}\n${formatMailPreview(raw_message)}`;
    await sendNotification(env, message);
    return new Response('Email received', { status: 200 });
  } catch (error) {
    return jsonError(`接收失败：${error.message}`);
  }
}

async function sendNotification(env, message) {
  try {
    const webhookUrl = env.WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      });
      console.log('Notification sent');
    } else {
      console.log('[Notification logged]:', message);
    }
  } catch (error) {
    console.error('Notification failed:', error);
  }
}

function formatMailPreview(rawMessage) {
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

function jsonError(msg) {
  return new Response(JSON.stringify({ success: false, error: msg }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' }
  });
}
