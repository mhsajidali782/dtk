import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

console.log("Starting server...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('dist'));

// Rotating proxy configuration (WeShare)
const getRotatingProxy = () => {
    const proxyDomain = process.env.PROXY_DOMAIN || 'p.webshare.io';
    const proxyPort = process.env.PROXY_PORT || '80';
    const proxyUsername = process.env.PROXY_USERNAME || 'cklymqsg-rotate';
    const proxyPassword = process.env.PROXY_PASSWORD || '0xn9q3p3bo1t';
    return `http://${proxyUsername}:${proxyPassword}@${proxyDomain}:${proxyPort}`;
};

// User-Agent rotation for reliability
const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
];

const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Helper for Supabase GraphQL
async function graphqlRequest(query, variables) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn("Missing Supabase env vars");
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

// API Routes
app.post('/api/download-tiktok', async (req, res) => {
    try {
        const { url } = req.body;
        console.log('Processing TikTok URL:', url);

        if (!url) return res.status(400).json({ error: 'URL is required' });

        // Cache check
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

        try {
            const { data } = await graphqlRequest(GET_CACHE, { url });
            if (data?.tiktok_cache?.length > 0) {
                const cached = data.tiktok_cache[0];
                console.log('Cache hit');
                return res.json({
                    no_watermark: cached.no_watermark_url,
                    watermark: cached.watermark_url,
                    music: cached.music_url,
                    title: cached.title,
                    thumbnail: cached.thumbnail_url,
                    author: cached.author_name,
                    authorAvatar: cached.author_avatar,
                    source: 'cache',
                    downloadUrl: cached.no_watermark_url,
                    filename: `tiktok-${Date.now()}.mp4`,
                });
            }
        } catch (e) {
            console.warn("Cache check failed:", e);
        }

        console.log('Fetching from TikWM...');

        // Use rotating proxy to bypass TikTok detection
        const proxyUrl = getRotatingProxy();
        const targetUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`;

        console.log(`Using proxy: ${proxyUrl}`);

        const tikRes = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': getRandomUserAgent(),
                'Referer': 'https://www.tiktok.com/',
            },
        });
        const data = await tikRes.json();

        if (data.code !== 0) throw new Error(data.msg || 'Failed to process video');

        const videoData = {
            video_url: url,
            no_watermark_url: data.data.hdplay || data.data.play,
            watermark_url: data.data.wmplay,
            music_url: data.data.music,
            title: data.data.title || 'TikTok Video',
            thumbnail_url: data.data.cover || data.data.origin_cover,
            author_name: data.data.author?.unique_id || 'Unknown',
            author_avatar: data.data.author?.avatar || '',
        };

        // Cache insert
        const INSERT_CACHE = `
            mutation InsertCache($object: tiktok_cache_insert_input!) {
                insert_tiktok_cache_one(object: $object, on_conflict: {constraint: tiktok_cache_pkey, update_columns: [no_watermark_url, watermark_url, music_url, title, thumbnail_url, author_name, author_avatar, expires_at]}) {
                    video_url
                }
            }
        `;
        graphqlRequest(INSERT_CACHE, { object: videoData }).catch(console.warn);

        res.json({
            no_watermark: videoData.no_watermark_url,
            watermark: videoData.watermark_url,
            music: videoData.music_url,
            title: videoData.title,
            thumbnail: videoData.thumbnail_url,
            author: videoData.author_name,
            authorAvatar: videoData.author_avatar,
            source: 'tikwm',
            downloadUrl: videoData.no_watermark_url,
            filename: `tiktok-${Date.now()}.mp4`,
        });

    } catch (error) {
        console.error('API Error:', error);
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/stream-video', async (req, res) => {
    try {
        const videoUrl = req.query.url;
        if (!videoUrl) return res.status(400).send('URL required');

        // Use rotating proxy to bypass TikTok detection
        const proxyUrl = getRotatingProxy();
        console.log(`Streaming video using proxy: ${proxyUrl}`);

        const response = await fetch(videoUrl, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Referer': 'https://www.tiktok.com/',
            }
        });

        if (!response.ok) throw new Error('Failed to fetch video');

        res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="tiktok-${Date.now()}.mp4"`);

        Readable.fromWeb(response.body).pipe(res);

    } catch (error) {
        console.error('Stream Error:', error);
        res.status(400).send('Failed to stream video');
    }
});

// SPA Fallback
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
