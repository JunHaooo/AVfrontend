'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { toast } from 'sonner'

type Article = {
  id: string
  title: string
  snippet: string
  source_domain: string
  published_date: string | null
  raw_date?: string | null
  category?: string
  geographic_region?: string
  relevance_score?: string
  image?: string | null
  url: string
}

async function fetchArticleData(url: string): Promise<Article> {
  const res = await fetch("/api/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error('Extraction failed')
  return res.json()
}

export default function UploadPage() {
  const [url, setUrl] = useState('')
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)
  const [imgErrored, setImgErrored] = useState(false)

  const handleExtract = async () => {
    if (!url.trim()) {
      toast.error('Please enter a valid URL')
      return
    }
    setLoading(true)
    setArticle(null)
    setImgErrored(false)

    try {
      const data = await fetchArticleData(url.trim())
      setArticle(data)
      toast.success('Article extracted')
    } catch (err) {
      console.error(err)
      toast.error('Failed to extract article — check console for details')
    } finally {
      setLoading(false)
    }
  }

  const formatPublishedDate = (isoOrNull?: string | null) => {
    if (!isoOrNull) return article?.raw_date ? article.raw_date : 'Unknown'
    try {
      // show in Asia/Singapore timezone (user timezone per your app)
      return new Date(isoOrNull).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })
    } catch {
      return isoOrNull
    }
  }

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-xl border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Upload an Article by URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter article URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleExtract} disabled={loading}>
              {loading ? 'Extracting...' : 'Extract'}
            </Button>
          </div>

          <Separator />

          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-48 w-full rounded-md" />
            </div>
          )}

          {!loading && article && (
            <Card className="overflow-hidden shadow-md rounded-xl">
              {/* image area (constrained height) */}
              <div className="w-full">
                {article.image && !imgErrored ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={article.image}
                      alt={article.title || 'Article image'}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1200px"
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-xl"
                      onError={() => setImgErrored(true)}
                      // next/image will try to load; if external host is blocked by Next config, it may fail.
                    />
                  </div>
                ) : (
                  <div className="w-full h-24 flex items-center justify-center bg-muted/30">
                    <p className="text-sm text-muted-foreground px-4">
                      {article.image && imgErrored
                        ? 'Image failed to load (blocked or invalid).'
                        : 'No preview image available.'}
                    </p>
                  </div>
                )}
              </div>

              <CardHeader className="pt-4">
                <CardTitle className="text-lg">{article.title || article.source_domain}</CardTitle>

                <div className="flex items-center gap-3 mt-2">
                  <Badge>{article.category || 'General'}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {formatPublishedDate(article.published_date)}
                  </p>
                  <p className="text-sm text-muted-foreground">• {article.source_domain}</p>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-3">
                  {article.snippet || 'No snippet available.'}
                </p>

                <div className="flex gap-2">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-sm"
                  >
                    View Original Article
                  </a>
                  <span className="text-sm text-muted-foreground">|</span>
                  <button
                    className="text-sm text-muted-foreground underline"
                    onClick={() => {
                      // simple copy URL UX
                      navigator.clipboard?.writeText(article.url)
                      toast.success('Article URL copied')
                    }}
                  >
                    Copy URL
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && !article && (
            <p className="text-center text-muted-foreground">
              Paste an article URL above and click <strong>Extract</strong> to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
