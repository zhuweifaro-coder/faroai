const STATE_COOKIE = 'faro_oauth_state';
const SESSION_COOKIE = 'faro_session';
const STATE_MAX_AGE = 10 * 60;
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

const PROVIDERS = {
    github: {
        clientId: 'GITHUB_CLIENT_ID',
        clientSecret: 'GITHUB_CLIENT_SECRET',
        authorizeUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        scopes: 'read:user user:email'
    },
    google: {
        clientId: 'GOOGLE_CLIENT_ID',
        clientSecret: 'GOOGLE_CLIENT_SECRET',
        authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        scopes: 'openid email profile'
    }
};

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const pathname = url.pathname.replace(/\/+$/, '') || '/';

        if (pathname === '/api/auth/session') {
            return handleSession(request, env);
        }

        if (pathname === '/api/auth/logout') {
            return handleLogout(request);
        }

        const callbackMatch = pathname.match(/^\/api\/auth\/callback\/(github|google)$/);
        if (callbackMatch) {
            return handleCallback(callbackMatch[1], request, env);
        }

        const startMatch = pathname.match(/^\/api\/auth\/(github|google)$/);
        if (startMatch) {
            return handleStart(startMatch[1], request, env);
        }

        if (pathname.startsWith('/api/')) {
            return json({ error: 'not_found' }, 404);
        }

        return env.ASSETS.fetch(request);
    }
};

async function handleStart(provider, request, env) {
    try {
        const config = getProviderConfig(provider, env);
        const state = randomToken();
        const stateCookie = await createStateCookie(provider, state, request, env);
        const authorizeUrl = new URL(config.authorizeUrl);

        authorizeUrl.searchParams.set('client_id', config.clientIdValue);
        authorizeUrl.searchParams.set('redirect_uri', getCallbackUrl(request, env, provider));
        authorizeUrl.searchParams.set('response_type', 'code');
        authorizeUrl.searchParams.set('scope', config.scopes);
        authorizeUrl.searchParams.set('state', state);

        if (provider === 'google') {
            authorizeUrl.searchParams.set('prompt', 'select_account');
            authorizeUrl.searchParams.set('access_type', 'offline');
        }

        return redirect(authorizeUrl.toString(), {
            'Set-Cookie': stateCookie,
            'Cache-Control': 'no-store'
        });
    } catch (error) {
        return redirect(makeErrorRedirect(request, error.message || 'oauth_start_failed'));
    }
}

async function handleCallback(provider, request, env) {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const providerError = url.searchParams.get('error');

    if (providerError) {
        return redirect(makeErrorRedirect(request, providerError));
    }

    if (!code || !state) {
        return redirect(makeErrorRedirect(request, 'missing_oauth_code'));
    }

    try {
        const savedState = await readStateCookie(request, env);
        if (!savedState || savedState.provider !== provider || savedState.state !== state) {
            return redirect(makeErrorRedirect(request, 'invalid_oauth_state'));
        }

        const profile = await exchangeCodeForProfile(provider, code, request, env);
        const sessionCookie = await createSessionCookie(profile, request, env);
        const stateCookie = clearStateCookie(request);
        const response = redirect(makeSuccessRedirect(request, provider), {
            'Cache-Control': 'no-store'
        });

        response.headers.append('Set-Cookie', sessionCookie);
        response.headers.append('Set-Cookie', stateCookie);
        return response;
    } catch (error) {
        return redirect(makeErrorRedirect(request, error.message || 'oauth_callback_failed'), {
            'Set-Cookie': clearStateCookie(request),
            'Cache-Control': 'no-store'
        });
    }
}

async function handleSession(request, env) {
    const session = await readSession(request, env);
    return json({
        authenticated: Boolean(session?.user),
        user: session?.user || null
    });
}

function handleLogout(request) {
    const cookie = clearSessionCookie(request);
    if (request.method === 'POST') {
        return json({ ok: true }, 200, { 'Set-Cookie': cookie });
    }
    return redirect('/index.html?logout=1', {
        'Set-Cookie': cookie,
        'Cache-Control': 'no-store'
    });
}

function getProviderConfig(provider, env) {
    const config = PROVIDERS[provider];
    if (!config) {
        throw new Error('unsupported_provider');
    }

    const missing = [config.clientId, config.clientSecret, 'OAUTH_COOKIE_SECRET']
        .filter(key => !env[key]);

    if (missing.length) {
        throw new Error(`missing_env:${missing.join(',')}`);
    }

    return {
        ...config,
        clientIdValue: env[config.clientId],
        clientSecretValue: env[config.clientSecret]
    };
}

function getOrigin(request, env = {}) {
    if (env.OAUTH_REDIRECT_ORIGIN) {
        return String(env.OAUTH_REDIRECT_ORIGIN).replace(/\/+$/, '');
    }
    return new URL(request.url).origin;
}

function getCallbackUrl(request, env, provider) {
    return `${getOrigin(request, env)}/api/auth/callback/${provider}`;
}

function getCookie(request, name) {
    const cookie = request.headers.get('Cookie') || '';
    return cookie
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith(`${name}=`))
        ?.slice(name.length + 1) || '';
}

function serializeCookie(name, value, options = {}) {
    const parts = [`${name}=${value}`];
    parts.push(`Path=${options.path || '/'}`);
    if (typeof options.maxAge === 'number') parts.push(`Max-Age=${options.maxAge}`);
    if (options.httpOnly !== false) parts.push('HttpOnly');
    if (options.secure !== false) parts.push('Secure');
    parts.push(`SameSite=${options.sameSite || 'Lax'}`);
    return parts.join('; ');
}

function clearCookie(name, options = {}) {
    return serializeCookie(name, '', {
        path: options.path || '/',
        maxAge: 0,
        secure: options.secure
    });
}

function isSecureRequest(request) {
    return new URL(request.url).protocol === 'https:';
}

function redirect(location, headers = {}) {
    return new Response(null, {
        status: 302,
        headers: {
            Location: location,
            ...headers
        }
    });
}

function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            ...headers
        }
    });
}

function makeErrorRedirect(request, reason) {
    const url = new URL('/index.html', getOrigin(request));
    url.searchParams.set('login', 'error');
    url.searchParams.set('reason', reason);
    return url.pathname + url.search;
}

function makeSuccessRedirect(request, provider) {
    const url = new URL('/index.html', getOrigin(request));
    url.searchParams.set('login', 'success');
    url.searchParams.set('provider', provider);
    return url.pathname + url.search;
}

function randomToken(byteLength = 32) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return base64UrlEncodeBytes(bytes);
}

async function createSignedCookie(payload, secret, maxAgeSeconds) {
    const now = Date.now();
    const body = base64UrlEncode(JSON.stringify({
        ...payload,
        iat: now,
        exp: now + maxAgeSeconds * 1000
    }));
    const signature = await hmac(body, secret);
    return `${body}.${signature}`;
}

async function readSignedCookie(value, secret) {
    if (!value || !value.includes('.')) return null;

    const [body, signature] = value.split('.');
    const expected = await hmac(body, secret);
    if (!constantTimeEqual(signature, expected)) return null;

    try {
        const payload = JSON.parse(base64UrlDecode(body));
        if (!payload.exp || payload.exp < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

async function createStateCookie(provider, state, request, env) {
    const value = await createSignedCookie({ provider, state }, env.OAUTH_COOKIE_SECRET, STATE_MAX_AGE);
    return serializeCookie(STATE_COOKIE, value, {
        path: '/api/auth',
        maxAge: STATE_MAX_AGE,
        secure: isSecureRequest(request)
    });
}

async function readStateCookie(request, env) {
    const value = getCookie(request, STATE_COOKIE);
    return readSignedCookie(value, env.OAUTH_COOKIE_SECRET);
}

async function createSessionCookie(profile, request, env) {
    const user = {
        provider: profile.provider,
        id: profile.id,
        name: profile.name || profile.email || profile.username || 'FaroAI 用户',
        email: profile.email || '',
        avatar: profile.avatar || '',
        username: profile.username || ''
    };
    const value = await createSignedCookie({ user }, env.OAUTH_COOKIE_SECRET, SESSION_MAX_AGE);
    return serializeCookie(SESSION_COOKIE, value, {
        path: '/',
        maxAge: SESSION_MAX_AGE,
        secure: isSecureRequest(request)
    });
}

async function readSession(request, env) {
    if (!env.OAUTH_COOKIE_SECRET) return null;
    const value = getCookie(request, SESSION_COOKIE);
    return readSignedCookie(value, env.OAUTH_COOKIE_SECRET);
}

function clearStateCookie(request) {
    return clearCookie(STATE_COOKIE, {
        path: '/api/auth',
        secure: isSecureRequest(request)
    });
}

function clearSessionCookie(request) {
    return clearCookie(SESSION_COOKIE, {
        path: '/',
        secure: isSecureRequest(request)
    });
}

async function exchangeCodeForProfile(provider, code, request, env) {
    const config = getProviderConfig(provider, env);
    const redirectUri = getCallbackUrl(request, env, provider);

    if (provider === 'github') {
        return exchangeGitHubCode(config, code, redirectUri);
    }
    return exchangeGoogleCode(config, code, redirectUri);
}

async function exchangeGitHubCode(config, code, redirectUri) {
    const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id: config.clientIdValue,
            client_secret: config.clientSecretValue,
            code,
            redirect_uri: redirectUri
        })
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
        throw new Error(tokenData.error_description || tokenData.error || 'github_token_exchange_failed');
    }

    const userResponse = await fetch('https://api.github.com/user', {
        headers: githubHeaders(tokenData.access_token)
    });
    const user = await userResponse.json();
    if (!userResponse.ok) {
        throw new Error(user.message || 'github_user_fetch_failed');
    }

    let email = user.email || '';
    if (!email) {
        const emailResponse = await fetch('https://api.github.com/user/emails', {
            headers: githubHeaders(tokenData.access_token)
        });
        if (emailResponse.ok) {
            const emails = await emailResponse.json();
            const primary = emails.find(item => item.primary && item.verified) || emails.find(item => item.verified);
            email = primary?.email || '';
        }
    }

    return {
        provider: 'github',
        id: String(user.id),
        username: user.login || '',
        name: user.name || user.login || email,
        email,
        avatar: user.avatar_url || ''
    };
}

async function exchangeGoogleCode(config, code, redirectUri) {
    const body = new URLSearchParams({
        client_id: config.clientIdValue,
        client_secret: config.clientSecretValue,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
    });

    const tokenResponse = await fetch(config.tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });
    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
        throw new Error(tokenData.error_description || tokenData.error || 'google_token_exchange_failed');
    }

    const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`
        }
    });
    const user = await userResponse.json();
    if (!userResponse.ok) {
        throw new Error(user.error_description || user.error || 'google_user_fetch_failed');
    }

    return {
        provider: 'google',
        id: user.sub,
        username: '',
        name: user.name || user.email,
        email: user.email || '',
        avatar: user.picture || ''
    };
}

function githubHeaders(accessToken) {
    return {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'FaroAI-OAuth'
    };
}

async function hmac(value, secret) {
    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
    return base64UrlEncodeBytes(new Uint8Array(signature));
}

function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;
    let diff = a.length ^ b.length;
    const length = Math.max(a.length, b.length);
    for (let index = 0; index < length; index += 1) {
        diff |= (a.charCodeAt(index) || 0) ^ (b.charCodeAt(index) || 0);
    }
    return diff === 0;
}

function base64UrlEncode(value) {
    const bytes = new TextEncoder().encode(value);
    return base64UrlEncodeBytes(bytes);
}

function base64UrlEncodeBytes(bytes) {
    let binary = '';
    bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function base64UrlDecode(value) {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}
