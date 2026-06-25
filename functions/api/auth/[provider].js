import {
    OAuthConfigError,
    createStateCookie,
    getCallbackUrl,
    getProvider,
    getProviderConfig,
    makeErrorRedirect,
    randomToken,
    redirect
} from '../../_shared/oauth.js';

export async function onRequestGet({ request, env, params }) {
    const provider = getProvider(params.provider);
    if (!provider) {
        return redirect(makeErrorRedirect(request, 'unsupported_provider'));
    }

    try {
        const config = getProviderConfig(provider, env);
        const state = randomToken();
        const stateCookie = await createStateCookie(provider, state, request, env);
        const authorizeUrl = buildAuthorizeUrl(provider, config, request, env, state);

        return redirect(authorizeUrl.toString(), {
            'Set-Cookie': stateCookie,
            'Cache-Control': 'no-store'
        });
    } catch (error) {
        const reason = error instanceof OAuthConfigError ? error.message : 'oauth_start_failed';
        return redirect(makeErrorRedirect(request, reason));
    }
}

function buildAuthorizeUrl(provider, config, request, env, state) {
    const url = new URL(config.authorizeUrl);
    url.searchParams.set('client_id', config.clientIdValue);
    url.searchParams.set('redirect_uri', getCallbackUrl(request, env, provider));
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', config.scopes);
    url.searchParams.set('state', state);

    if (provider === 'google') {
        url.searchParams.set('prompt', 'select_account');
        url.searchParams.set('access_type', 'offline');
    }

    return url;
}
