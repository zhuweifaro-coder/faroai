const SHANGHAI_OFFSET_MS = 8 * 60 * 60 * 1000;
const CACHE_BASE = 'https://faroai.internal/visit-counter/';
const MEMORY_STORE = globalThis.__FAROAI_VISIT_COUNTERS__ || new Map();
globalThis.__FAROAI_VISIT_COUNTERS__ = MEMORY_STORE;

export async function handleVisitRequest(request, env = {}) {
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: visitHeaders({
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            })
        });
    }

    if (!['GET', 'POST'].includes(request.method)) {
        return visitJson({ ok: false, error: 'method_not_allowed' }, 405, {
            Allow: 'GET, POST, OPTIONS'
        });
    }

    const date = getShanghaiDateKey();
    const shouldIncrement = request.method === 'POST';
    const snapshot = await readVisitSnapshot(env, date, shouldIncrement);

    return visitJson({
        ok: true,
        total: snapshot.total,
        today: snapshot.today,
        date,
        updatedAt: snapshot.updatedAt,
        source: snapshot.source,
        durable: snapshot.durable,
        mode: 'pageview'
    });
}

async function readVisitSnapshot(env, date, shouldIncrement) {
    const kv = getVisitKV(env);
    if (kv) {
        return readKVSnapshot(kv, date, shouldIncrement);
    }

    if (globalThis.caches?.default) {
        return readCacheSnapshot(date, shouldIncrement);
    }

    return readMemorySnapshot(date, shouldIncrement);
}

function getVisitKV(env) {
    return env.VISIT_COUNTERS || env.FAROAI_VISITS || env.FAROAI_VISIT_KV || null;
}

async function readKVSnapshot(kv, date, shouldIncrement) {
    const todayKey = `day:${date}`;
    let [total, today] = await Promise.all([
        readKVNumber(kv, 'total'),
        readKVNumber(kv, todayKey)
    ]);

    if (shouldIncrement) {
        total += 1;
        today += 1;
        await Promise.all([
            kv.put('total', String(total)),
            kv.put(todayKey, String(today)),
            kv.put('updatedAt', new Date().toISOString())
        ]);
    }

    const updatedAt = await kv.get('updatedAt');
    return {
        total,
        today,
        updatedAt: updatedAt || new Date().toISOString(),
        source: 'kv',
        durable: true
    };
}

async function readKVNumber(kv, key) {
    const value = await kv.get(key);
    return toCounterNumber(value);
}

async function readCacheSnapshot(date, shouldIncrement) {
    const todayKey = `day:${date}`;
    let [total, today] = await Promise.all([
        readCacheNumber('total'),
        readCacheNumber(todayKey)
    ]);

    if (shouldIncrement) {
        total += 1;
        today += 1;
        await Promise.all([
            writeCacheNumber('total', total),
            writeCacheNumber(todayKey, today),
            writeCacheNumber('updatedAt', Date.now())
        ]);
    }

    const updatedAtMs = await readCacheNumber('updatedAt');
    return {
        total,
        today,
        updatedAt: updatedAtMs ? new Date(updatedAtMs).toISOString() : new Date().toISOString(),
        source: 'cache',
        durable: false
    };
}

async function readCacheNumber(key) {
    const response = await caches.default.match(new Request(`${CACHE_BASE}${encodeURIComponent(key)}`));
    if (!response) return 0;
    return toCounterNumber(await response.text());
}

async function writeCacheNumber(key, value) {
    await caches.default.put(
        new Request(`${CACHE_BASE}${encodeURIComponent(key)}`),
        new Response(String(value), {
            headers: {
                'Cache-Control': 'public, max-age=31536000',
                'Content-Type': 'text/plain; charset=utf-8'
            }
        })
    );
}

function readMemorySnapshot(date, shouldIncrement) {
    const todayKey = `day:${date}`;
    let total = toCounterNumber(MEMORY_STORE.get('total'));
    let today = toCounterNumber(MEMORY_STORE.get(todayKey));

    if (shouldIncrement) {
        total += 1;
        today += 1;
        MEMORY_STORE.set('total', String(total));
        MEMORY_STORE.set(todayKey, String(today));
        MEMORY_STORE.set('updatedAt', new Date().toISOString());
    }

    return {
        total,
        today,
        updatedAt: MEMORY_STORE.get('updatedAt') || new Date().toISOString(),
        source: 'memory',
        durable: false
    };
}

function getShanghaiDateKey(now = new Date()) {
    return new Date(now.getTime() + SHANGHAI_OFFSET_MS).toISOString().slice(0, 10);
}

function toCounterNumber(value) {
    const number = Number(value || 0);
    if (!Number.isFinite(number) || number < 0) return 0;
    return Math.floor(number);
}

function visitJson(data, status = 200, headers = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: visitHeaders(headers)
    });
}

function visitHeaders(extra = {}) {
    return {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        ...extra
    };
}
