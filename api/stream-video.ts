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

const getRandomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'authorization, x-client-info, apikey, content-type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url } = req.query;

        console.log('Streaming video from URL:', url);

        if (!url) {
            return res.status(400).json({ error: 'Video URL is required' });
        }

        if (!url.includes('tiktokcdn.com') && !url.includes('tiktok.com')) {
            return res.status(400).json({ error: 'Invalid video URL' });
        }

        console.log(`Streaming video from: ${url}`);

        const videoResponse = await fetch(url, {
            headers: {
                'User-Agent': getRandomUserAgent(),
                'Referer': 'https://www.tiktok.com/',
                'Accept': '*/*',
            },
        });

        if (!videoResponse.ok) {
            throw new Error(`Failed to fetch video: ${videoResponse.status} ${videoResponse.statusText}`);
        }

        const contentLength = videoResponse.headers.get('content-length') || '';
        const contentType = videoResponse.headers.get('content-type') || 'video/mp4';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', contentLength);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Stream the video
        const arrayBuffer = await videoResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.status(200).send(buffer);
    } catch (error) {
        console.error('Error in stream-video function:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to stream video';
        return res.status(400).json({ error: errorMessage });
    }
}