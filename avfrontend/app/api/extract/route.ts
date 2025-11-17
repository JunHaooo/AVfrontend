import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ message: 'URL is required' }, { status: 400 })
    }

    const apiKey = process.env.SCRAPINGBEE_API_KEY
    if (!apiKey) {
      throw new Error('ScrapingBee API key is not configured in .env.local')
    }

    // Use a proxy/scraper service to avoid being blocked
    const response = await axios.get('https://app.scrapingbee.com/api/v1/', {
      params: {
        api_key: apiKey,
        url: url,
        render_js: true, // Tell ScrapingBee to run a full browser to render JavaScript
        // Pass extract_rules as a stringified JSON object. Axios will handle encoding.
        extract_rules: JSON.stringify({
          "title": "title",
          "snippet": "meta[name='description']@content",
          "image": "meta[property='og:image']@content",
        }),
      },
    });

    // The data from ScrapingBee is already a JSON object with the extracted fields
    const extractedData = response.data

    // Construct the final Article object
    const articleData = {
      id: new Date().toISOString(),
      title: extractedData.title || 'No title found',
      snippet: extractedData.snippet || 'No snippet available.',
      image: extractedData.image || null,
      source_domain: new URL(url).hostname,
      published_date: new Date().toISOString(), // Placeholder, real date extraction is more complex
      url: url,
    }

    return NextResponse.json(articleData)
  } catch (error) {
    // Improved error logging to show the actual response from the failed request
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Details:', error.response?.data);
      const apiMessage = error.response?.data?.message || error.message;
      return NextResponse.json({ message: apiMessage }, { status: error.response?.status || 500 });
    }

    console.error('Generic API Error:', error);
    const message = error instanceof Error ? error.message : 'An internal server error occurred';
    return NextResponse.json({ message }, { status: 500 })
  }
}