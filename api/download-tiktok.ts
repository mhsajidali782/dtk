export const config = {
    runtime: 'nodejs',
};

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
];

const getRotatingProxy = () => {
    const proxyDomain = process.env.PROXY_DOMAIN || 'p.webshare.io';
    const proxyPort = process.env.PROXY_PORT || '80';
    const proxyUsername = process.env.PROXY_USERNAME || 'cklymqsg-rotate';
    const proxyPassword = process.env.PROXY_PASSWORD || '0xn9q3p3bo1t';
    return `http://${proxyUsername}:${proxyPassword}@${proxyDomain}:${proxyPort}`;
};

const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3) => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt + 1}/${maxRetries} - Fetching: ${url}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response;
        } catch (error) {
            lastError = error as Error;
            console.error(`Attempt ${attempt + 1} failed:`, error);

            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new Error('All retry attempts failed');
};

async function graphqlRequest(query: string, variables: any) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn("Missing Supabase env vars, skipping DB operations");
        return { data: null, error: "Missing env vars" };
    }

    const endpoint = `${supabaseUrl}/rest/v1/rpc/graphql`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ query, variables })
        });

        const result = await response.json();
        return { data: result.data, error: result.errors };
    } catch (error) {
        console.error("GraphQL request failed:", error);
        return { data: null, error };
    }
}

// Vercel serverless function handler
module.exports = async function handler(req: any, res: any) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.body;

        console.log('Processing TikTok URL:', url);

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!url.includes('tiktok.com')) {
            return res.status(400).json({ error: 'Invalid TikTok URL' });
        }

        // Check cache first
        console.log('Checking cache for URL...');
        const GET_CACHE = `
      query GetCache($url: String!) {
        tiktok_cache(where: {video_url: {_eq: $url}, expires_at: {_gt: "now()"}}, limit: 1) {
          no_watermark_url
          watermark_url
          music_url
          title
          thumbnail_url
          author_name
          author_avatar
        }
      }
    `;

        let cachedData = null;
        try {
            const { data, error } = await graphqlRequest(GET_CACHE, { url });
            if (!error && data?.tiktok_cache?.length > 0) {
                cachedData = data.tiktok_cache[0];
            }
        } catch (e) {
            console.warn("Cache check failed (likely table missing), proceeding without cache:", e);
        }

        if (cachedData) {
            console.log('Cache hit! Returning cached data');
            return res.status(200).json({
                no_watermark: cachedData.no_watermark_url,
                watermark: cachedData.watermark_url,
                music: cachedData.music_url,
                title: cachedData.title,
                thumbnail: cachedData.thumbnail_url,
                author: cachedData.author_name,
                authorAvatar: cachedData.author_avatar,
                source: 'cache',
                downloadUrl: cachedData.no_watermark_url,
                filename: `tiktok-${Date.now()}.mp4`,
            });
        }

        console.log('Cache miss. Fetching from TikWM API...');

        const targetUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;

        console.log(`Fetching from: ${targetUrl}`);

        const response = await fetchWithRetry(
            targetUrl,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': getRandomUserAgent(),
                    'Referer': 'https://www.tiktok.com/',
                    'Accept': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.code !== 0) {
            throw new Error(data.msg || 'Failed to process video');
        }

        const noWatermarkUrl = data.data?.hdplay || data.data?.play;
        const watermarkUrl = data.data?.wmplay;
        const musicUrl = data.data?.music;
        const thumbnailUrl = data.data?.cover || data.data?.origin_cover;
        const title = data.data?.title || 'TikTok Video';
        const authorName = data.data?.author?.unique_id || data.data?.author?.nickname || 'Unknown';
        const authorAvatar = data.data?.author?.avatar || '';

        if (!noWatermarkUrl) {
            throw new Error('Could not extract video URL');
        }

        // Cache the result
        console.log('Caching data in database...');
        const INSERT_CACHE = `
      mutation InsertCache($object: tiktok_cache_insert_input!) {
        insert_tiktok_cache_one(object: $object, on_conflict: {constraint: tiktok_cache_pkey, update_columns: [no_watermark_url, watermark_url, music_url, title, thumbnail_url, author_name, author_avatar, expires_at]}) {
          video_url
        }
      }
    `;

        try {
            await graphqlRequest(INSERT_CACHE, {
                object: {
                    video_url: url,
                    no_watermark_url: noWatermarkUrl,
                    watermark_url: watermarkUrl,
                    music_url: musicUrl,
                    title: title,
                    thumbnail_url: thumbnailUrl,
                    author_name: authorName,
                    author_avatar: authorAvatar,
                }
            });
        } catch (e) {
            console.warn("Cache insert failed (likely table missing), ignoring:", e);
        }

        return res.status(200).json({
            no_watermark: noWatermarkUrl,
            watermark: watermarkUrl,
            music: musicUrl,
            title: title,
            thumbnail: thumbnailUrl,
            author: authorName,
            authorAvatar: authorAvatar,
            source: 'tikwm',
            downloadUrl: noWatermarkUrl,
            filename: `tiktok-${Date.now()}.mp4`,
            coverUrl: thumbnailUrl,
        });
    } catch (error) {
        console.error('Error in download-tiktok function:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to process video';

        return res.status(400).json({ error: errorMessage });
    }
}