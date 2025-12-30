import mongoose, { Schema, models, model } from "mongoose"

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    snippet: String,
    source_domain: String,
    published_date: Date,
    category: String,
    geographic_region: String,
    relevance_score: Number,
    image: String,
    full_text: String,
  },
  { timestamps: true }
)

export const Article =
  models.Article || model("Article", ArticleSchema)
