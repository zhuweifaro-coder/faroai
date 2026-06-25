const STATE_COOKIE = 'faro_oauth_state';
const SESSION_COOKIE = 'faro_session';
const STATE_MAX_AGE = 10 * 60;
const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

const PROVIDERS = {
    github: {
        label: 'GitHub',
        clientId: 'GITHUB_CLIENT_ID',
        clientSecret: 'GITHUB_CLIENT_SECRET',
        authorizeUrl: 'https://github.com/login/oauth/authorize',
        tokenUrl: 'https://github.com/login/oauth/access_token',
        scopes: 'read:user user:email'
    },
    google: {
        label: 'Google',
        clientId: 'GOOGLE_CLIENT_ID',
        clientSecret: 'GOOGLE_CLIENT_SECRET',
        authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenUrl: 'https://oauth2.googleapis.com/token',
        scopes: 'openid email profile'
    }
};

export class OAuthConfigError extends Error {
    constructor(message) {
        super(message);
        this.name = 'OAuthConfigError';
    }
}

export function getProvider(provider) {
    const normalized = String(provider || '').toLowerCase();
    return PROVIDERS[normalized] ? normalized : null;
}

export function getProviderConfig(provider, env) {
    const normalized = getProvider(provider);
    if (!normalized) {
        throw new OAuthConfigError('unsupported_provider');
    }

    const config = PROVIDERS[normalized];
    const missing = [config.clientId, config.clientSecret, 'OAUTH_COOKIE_SECRET']
        .filter(key => !env[key]);

    if (missing.length) {
        throw new OAuthConfigError(`missing_env:${missing.join(',')}`);
    }

    return {
        name: normalized,
        ...config,
        clientIdValue: env[config.clientId],
        clientSecretValue: env[config.clientSecret]
    };
}

export function getOrigin(request, env) {
    if (env.OAUTH_REDIRECT_ORIGIN) {
        return String(env.OAUTH_REDIRECT_ORIGIN).replace(/\/+$/, '');
    }
    return new URL(request.url).origin;
}

export function getCallbackUrl(request, env, provider) {
    return `${getOrigin(request, env)}/api/auth/callback/${provider}`;
}

export function getCookie(request, name) {
    const cookie = request.headers.get('Cookie') || '';
    return cookie
        .split(';')
        .map(part => part.trim())
        .find(part => part.startsWith(`${name}=`))
        ?.slice(name.length + 1) || '';
}

export function serializeCookie(name, value, options = {}) {
    const parts = [`${name}=${value}`];
    const path = options.path || '/';

    parts.push(`Path=${path}`);
    if (typeof options.maxAge === 'number') parts.push(`Max-Age=${options.maxAge}`);
    if (options.httpOnly !== false) parts.push('HttpOnly');
    if (options.secure !== false) parts.push('Secure');
    parts.push(`SameSite=${options.sameSite || 'Lax'}`);

    return parts.join('; ');
}

export function clearCookie(name, options = {}) {
    return serializeCookie(name, '', {
        path: options.path || '/',
        maxAge: 0,
        secure: options.secure
    });
}

export function isSecureRequest(request) {
    return new URL(request.url).protocol === 'https:';
}

export function redirect(location, headers = {}) {
    return new Response(null, {
        status: 302,
        headers: {
            Location: location,
            ...headers
        }
    });
}

export function json(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            ...headers
        }
    });
}

export function makeErrorRedirect(request, reason) {
    const url = new URL('/index.html', getOrigin(request, {}));
    url.searchParams.set('login', 'error');
    url.searchParams.set('reason', reason);
    return url.pathname + url.search;
}

export function makeSuccessRedirect(request, provider) {
    const url = new URL('/index.html', getOrigin(request, {}));
    url.searchParams.set('login', 'success');
    url.searchParams.set('provider', provider);
    return url.pathname + url.search;
}

export function randomToken(byteLength = 32) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return base64UrlEncodeBytes(bytes);
}

export async function createSignedCookie(payload, secret, maxAgeSeconds) {
    const now = Date.now();
    const body = base64UrlEncode(JSON.stringify({
        ...payload,
        iat: now,
        exp: now + maxAgeSeconds * 1000
    }));
    const signature = await hmac(body, secret);
    return `${body}.${signature}`;
}

export async function readSignedCookie(value, secret) {
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

export async function createStateCookie(provider, state, request, env) {
    const payload = {
        provider,
        state
    };
    const value = await createSignedCookie(payload, env.OAUTH_COOKIE_SECRET, STATE_MAX_AGE);
    return serializeCookie(STATE_COOKIE, value, {
        path: '/api/auth',
        maxAge: STATE_MAX_AGE,
        secure: isSecureRequest(request)
    });
}

export async function readStateCookie(request, env) {
    const value = getCookie(request, STATE_COOKIE);
    return readSignedCookie(value, env.OAUTH_COOKIE_SECRET);
}

export async function createSessionCookie(profile, request, env) {
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

export async function readSession(request, env) {
    if (!env.OAUTH_COOKIE_SECRET) return null;
    const value = getCookie(request, SESSION_COOKIE);
    return readSignedCookie(value, env.OAUTH_COOKIE_SECRET);
}

export function clearStateCookie(request) {
    return clearCookie(STATE_COOKIE, {
        path: '/api/auth',
        secure: isSecureRequest(request)
    });
}

export function clearSessionCookie(request) {
    return clearCookie(SESSION_COOKIE, {
        path: '/',
        secure: isSecureRequest(request)
    });
}

export async function exchangeCodeForProfile(provider, code, request, env) {
    const config = getProviderConfig(provider, env);
    const redirectUri = getCallbackUrl(request, env, provider);

    if (provider === 'github') {
        return exchangeGitHubCode(config, code, redirectUri);
    }
    if (provider === 'google') {
        return exchangeGoogleCode(config, code, redirectUri);
    }
    throw new OAuthConfigError('unsupported_provider');
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
