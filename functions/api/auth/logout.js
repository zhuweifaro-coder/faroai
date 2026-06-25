import { clearSessionCookie, json, redirect } from '../../_shared/oauth.js';

export async function onRequestPost({ request }) {
    return json(
        { ok: true },
        200,
        {
            'Set-Cookie': clearSessionCookie(request)
        }
    );
}

export async function onRequestGet({ request }) {
    return redirect('/index.html?logout=1', {
        'Set-Cookie': clearSessionCookie(request),
        'Cache-Control': 'no-store'
    });
}
