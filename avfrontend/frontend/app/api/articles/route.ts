import { NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import { Article } from "@/models/Article"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    if (!body.url) {
      return NextResponse.json(
        { message: "URL is required" },
        { status: 400 }
      )
    }

    await connectMongo()

    const article = await Article.findOneAndUpdate(
      { url: body.url }, // 🔑 unique key
      {
        title: body.title,
        snippet: body.snippet,
        source_domain: body.source_domain,
        published_date: body.published_date
          ? new Date(body.published_date)
          : null,
        category: body.category,
        geographic_region: body.geographic_region,
        relevance_score: body.relevance_score,
        image: body.image,
        full_text: body.full_text, // ✅ IMPORTANT
      },
      {
        upsert: true, // create if not exists
        new: true,    // return updated doc
      }
    )

    return NextResponse.json(article, { status: 200 })
  } catch (error) {
    console.error("Save article error:", error)
    return NextResponse.json(
      { message: "Failed to save article" },
      { status: 500 }
    )
  }
}
