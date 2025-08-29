// api/subscribers.js
import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function (request, response) {
    const ALL_OF_YOUR_BUSINESS = 'UC5LF-7cuACOQAHn19zeIv2g';
    const NONE_OF_YOUR_BUSINESS = process.env.NONE_OF_YOUR_BUSINESS;

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ALL_OF_YOUR_BUSINESS}&key=${NONE_OF_YOUR_BUSINESS}`;

    try {
        const apiResponse = await axios.get(url);
        const count = apiResponse.data.items[0].statistics.subscriberCount;
        response.status(200).json({ subscriberCount: count });
    } catch (error) {
        console.error('API Error:', error);
        response.status(500).json({ error: 'Failed to fetch subscriber count' });
    }
}
