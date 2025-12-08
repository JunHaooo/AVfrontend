"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function Home() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const categories = ["All", "Technology", "Policy", "Science"]

  const handleSearch = async () => {
    setLoading(true)

    try {
      // Fetch data from backend
      const res = await fetch("http://localhost:3001/api/news")
      const data = await res.json()

      // Flatten results array from each document
      const allResults = data // no .map().flat() because your docs are already individual news items

    const filtered = allResults.filter((item: any) => {
      if (!item?.title || !item?.snippet) return false

      const matchesQuery =
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.snippet.toLowerCase().includes(query.toLowerCase())

      const matchesCategory = category === "All" || item.category === category

      return matchesQuery && matchesCategory
    })

    setResults(filtered)
    } catch (err) {
      console.error("Error fetching news:", err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [query, category])

  const formatDate = (iso: string) =>
    new Date(iso).toISOString().slice(0, 16).replace("T", " ")

  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-background">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>

      {/* Search controls */}
      <div className="flex gap-2 mb-8 w-full max-w-3xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className="flex-1 p-2 border rounded-lg shadow-md bg-card text-card-foreground focus:ring-2 focus:ring-primary/70"
        />

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px] shadow-md">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/80 shadow-md rounded-lg"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <ScrollArea className="w-full max-w-3xl h-[80vh] rounded-lg border p-4">
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 shadow rounded-lg">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex flex-col gap-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : results.length > 0 ? (
            results
              .sort(
                (a, b) =>
                  new Date(b.published_date).getTime() -
                  new Date(a.published_date).getTime()
              )
              .map((news) => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow cursor-pointer">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Image
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex flex-col">
                        <CardTitle className="text-xl text-foreground">
                          {news.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-accent text-accent-foreground">
                            {news.category}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(news.published_date)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base text-muted-foreground">
                        {news.snippet}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))
          ) : (
            <p className="text-center text-muted-foreground">
              No results found.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
