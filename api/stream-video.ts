export const config = {
    runtime: 'edge',
};

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

export default async function handler(req: Request) {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);
        const videoUrl = url.searchParams.get('url');

        console.log('Streaming video from URL:', videoUrl);

        if (!videoUrl) {
            throw new Error('Video URL is required');
        }

        if (!videoUrl.includes('tiktokcdn.com')) {
            throw new Error('Invalid video URL - must be from TikTok CDN');
        }

        // Use rotating proxy to bypass TikTok detection
        const proxyUrl = getRotatingProxy();
        console.log(`Streaming video using proxy: ${proxyUrl}`);

        const videoResponse = await fetch(videoUrl, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Referer': 'https://www.tiktok.com/',
            },
        });

        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch video: ${videoResponse.status} ${videoResponse.statusText}`);
        }

        const contentLength = videoResponse.headers.get('content-length');
        const contentType = videoResponse.headers.get('content-type') || 'video/mp4';

        return new Response(videoResponse.body, {
            headers: {
                ...corsHeaders,
                'Content-Type': contentType,
                'Content-Length': contentLength || '',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error in stream-video function:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to stream video';

        return new Response(
            JSON.stringify({ error: errorMessage }),
            {
                status: 400,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}
