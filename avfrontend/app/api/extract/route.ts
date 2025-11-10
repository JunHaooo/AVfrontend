import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url || !/^https?:\/\//.test(url)) {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    // Try fetching the article HTML
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
      },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (${res.status})` },
        { status: res.status }
      )
    }

    const html = await res.text()

    // 🧠 Extract <title>, <meta name="description">, etc.
    const titleMatch = html.match(/<title>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : "Untitled"

    const descMatch = html.match(
      /<meta\s+(?:name|property)=["']description["']\s+content=["']([^"']+)["']/i
    )
    const description = descMatch ? descMatch[1].trim() : ""

    const imageMatch = html.match(
      /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i
    )
    const image = imageMatch ? imageMatch[1].trim() : ""

    const publishedMatch = html.match(
      /<meta\s+(?:property|name)=["']article:published_time["']\s+content=["']([^"']+)["']/i
    )
    const published_date = publishedMatch
      ? publishedMatch[1]
      : new Date().toISOString()

    const domain = new URL(url).hostname

    const data = {
      title,
      snippet: description,
      image,
      url,
      source_domain: domain,
      published_date,
      category: "General",
      geographic_region: "Unknown",
      relevance_score: "0.9",
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error extracting article:", error)
    return NextResponse.json(
      { error: "Failed to extract article" },
      { status: 500 }
    )
  }
}


