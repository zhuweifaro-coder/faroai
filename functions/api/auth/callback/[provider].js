import {
    OAuthConfigError,
    clearStateCookie,
    createSessionCookie,
    exchangeCodeForProfile,
    getProvider,
    makeErrorRedirect,
    makeSuccessRedirect,
    readStateCookie,
    redirect
} from '../../../_shared/oauth.js';

export async function onRequestGet({ request, env, params }) {
    const provider = getProvider(params.provider);
    if (!provider) {
        return redirect(makeErrorRedirect(request, 'unsupported_provider'));
    }

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
        const reason = error instanceof OAuthConfigError ? error.message : 'oauth_callback_failed';
        return redirect(makeErrorRedirect(request, reason), {
            'Set-Cookie': clearStateCookie(request),
            'Cache-Control': 'no-store'
        });
    }
}
