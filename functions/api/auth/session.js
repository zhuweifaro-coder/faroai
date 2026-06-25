import { json, readSession } from '../../_shared/oauth.js';

export async function onRequestGet({ request, env }) {
    const session = await readSession(request, env);

    return json({
        authenticated: Boolean(session?.user),
        user: session?.user || null
    });
}
