import { handleVisitRequest } from '../_shared/visits.js';

export async function onRequestGet({ request, env }) {
    return handleVisitRequest(request, env);
}

export async function onRequestPost({ request, env }) {
    return handleVisitRequest(request, env);
}

export async function onRequestOptions({ request, env }) {
    return handleVisitRequest(request, env);
}
