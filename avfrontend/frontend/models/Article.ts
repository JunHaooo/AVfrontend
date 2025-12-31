import mongoose, { Schema, models, model } from "mongoose"

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true, index: true },
    snippet: String,
    source_domain: String,
    published_date: Date,
    category: String,
    geographic_region: String,
    relevance_score: Number,
    image: String,
    full_text: String,
  },
  {
    timestamps: true,
  }
)

// Prevent model overwrite errors in Next.js / hot reload / Docker
export const Article =
  models.Article ?? model("Article", ArticleSchema)
