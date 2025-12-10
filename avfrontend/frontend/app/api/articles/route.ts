import { NextResponse } from "next/server"
import { connectMongo } from "@/lib/mongodb"
import { Article } from "@/models/Article"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    await connectMongo()

    const existing = await Article.findOne({ url: body.url })
    if (existing) {
      return NextResponse.json(
        { message: "Article already exists" },
        { status: 409 }
      )
    }

    const article = await Article.create({
      title: body.title,
      url: body.url,
      snippet: body.snippet,
      source_domain: body.source_domain,
      published_date: body.published_date
        ? new Date(body.published_date)
        : null,
      category: body.category,
      geographic_region: body.geographic_region,
      relevance_score: body.relevance_score,
      image: body.image,
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Save article error:", error)
    return NextResponse.json(
      { message: "Failed to save article" },
      { status: 500 }
    )
  }
}
