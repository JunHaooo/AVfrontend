"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

/* =========================
   Types
========================= */

type NewsSearchItem = {
  id: string
  title: string
  url: string
  snippet: string
  source_domain: string
  published_date: string
  category?: string
  geographic_region?: string
  relevance_score?: string
}

/* =========================
   Component
========================= */

export default function NewsSearch() {
  const [query, setQuery] = useState<string>("")
  const [results, setResults] = useState<NewsSearchItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  // Temporary mock data based on schema
  const mockResults: NewsSearchItem[] = [
    {
      id: "1",
      title: "Waymo Expands Testing to More Cities",
      url: "https://example.com/waymo-testing",
      snippet:
        "Waymo has announced new autonomous vehicle tests in several US cities.",
      source_domain: "example.com",
      published_date: "2025-09-15T10:30:00Z",
      category: "Technology",
      geographic_region: "US",
      relevance_score: "0.95",
    },
    {
      id: "2",
      title:
        "Self-Driving Cars Gain Regulatory Approval in California",
      url: "https://example.com/self-driving-cars",
      snippet:
        "California regulators approved new rules allowing autonomous taxis in San Francisco.",
      source_domain: "example.com",
      published_date: "2025-09-10T08:00:00Z",
      category: "Policy",
      geographic_region: "California",
      relevance_score: "0.88",
    },
  ]

  const handleSearch = async () => {
    setLoading(true)

    try {
      // Simulate backend call with mock results
      setTimeout(() => {
        setResults(mockResults)
        setLoading(false)
      }, 1000)

      // Uncomment when backend is ready
      /*
      const response = await fetch("/api/news-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const data: { results: NewsSearchItem[] } = await response.json()
      setResults(data.results ?? [])
      setLoading(false)
      */
    } catch (error) {
      console.error("Error fetching news:", error)
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Search input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search news..."
          className="flex-1 p-2 border rounded-lg shadow-sm"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <p className="text-gray-500">
          No results found. Try another query.
        </p>
      )}

      {/* Results */}
      <div className="grid gap-4">
        {results.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition">
            <CardContent className="p-4">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-semibold text-blue-700 hover:underline"
              >
                {item.title}
              </a>

              <p className="mt-2 text-gray-700">{item.snippet}</p>

              <div className="mt-3 text-sm text-gray-500 flex flex-wrap gap-2">
                <span>{item.source_domain}</span>
                <span>
                  •{" "}
                  {new Date(item.published_date).toLocaleDateString()}
                </span>

                {item.category && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded-lg">
                    {item.category}
                  </span>
                )}

                {item.geographic_region && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded-lg">
                    {item.geographic_region}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
