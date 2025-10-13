'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// Mock data
const mockNewsData = [
  {
    id: "1",
    title: "Waymo Expands Testing to More Cities",
    url: "https://example.com/waymo-testing",
    snippet: "Waymo has announced new autonomous vehicle tests in several US cities.",
    source_domain: "example.com",
    published_date: "2025-09-15T10:30:00Z",
    category: "Technology",
    geographic_region: "US",
    relevance_score: "0.95",
    image: "/next.svg",
  },
  {
    id: "2",
    title: "Self-Driving Cars Gain Regulatory Approval in California",
    url: "https://example.com/self-driving-cars",
    snippet: "California regulators approved new rules allowing autonomous taxis in San Francisco.",
    source_domain: "example.com",
    published_date: "2025-09-10T08:00:00Z",
    category: "Policy",
    geographic_region: "California",
    relevance_score: "0.88",
    image: "/globe.svg",
  },
  {
    id: "3",
    title: "Breakthrough in Renewable Energy Storage",
    url: "https://example.com/renewable-energy",
    snippet: "Researchers have developed a new battery technology that could revolutionize renewable energy adoption worldwide.",
    source_domain: "example.com",
    published_date: "2025-09-13T18:45:00Z",
    category: "Science",
    geographic_region: "Global",
    relevance_score: "0.92",
    image: "/window.svg",
  },
]

export default function Home() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [results, setResults] = useState(mockNewsData)
  const [loading, setLoading] = useState(false)

  const categories = ["All", "Technology", "Policy", "Science"]

  const handleSearch = () => {
    setLoading(true)

    setTimeout(() => {
      const filtered = mockNewsData.filter((item) => {
        const matchesQuery =
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.snippet.toLowerCase().includes(query.toLowerCase())

        const matchesCategory =
          category === "All" || item.category === category

        return matchesQuery && matchesCategory
      })

      setResults(filtered)
      setLoading(false)
    }, 500)
  }

  // Optional: run automatically when query or category changes
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
            // Loading skeleton
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
                <Card
                  key={news.id}
                  className="overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Image
                      src={news.image}
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
