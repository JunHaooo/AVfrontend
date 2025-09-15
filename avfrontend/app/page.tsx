import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

// Mock news data
const newsData = [
  {
    id: 1,
    title: "Next.js 15 Released with App Router Improvements",
    category: "Tech",
    date: "2025-09-15T10:30:00Z",
    excerpt: "The Next.js team has announced the release of version 15, bringing significant improvements to the App Router and better developer experience.",
    image: "/next.svg",
  },
  {
    id: 2,
    title: "Global Markets Rally Amid AI Boom",
    category: "Finance",
    date: "2025-09-14T08:00:00Z",
    excerpt: "Stock markets around the world surged today as companies investing in AI reported record-breaking earnings.",
    image: "/globe.svg",
  },
  {
    id: 3,
    title: "Breakthrough in Renewable Energy Storage",
    category: "Science",
    date: "2025-09-13T18:45:00Z",
    excerpt: "Researchers have developed a new battery technology that could revolutionize renewable energy adoption worldwide.",
    image: "/window.svg",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-background">
      <h1 className="text-3xl font-bold mb-6">Latest News</h1>

      <ScrollArea className="w-full max-w-3xl h-[80vh] rounded-lg border p-4">
        <div className="flex flex-col gap-6">
          {newsData.length > 0 ? (
            newsData
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((news) => (
                <Card key={news.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={60}
                      height={60}
                      className="rounded-md object-cover"
                    />
                    <div className="flex flex-col">
                      <CardTitle className="text-xl">{news.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{news.category}</Badge>
                        <p className="text-sm text-muted-foreground">
                          {new Date(news.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground">{news.excerpt}</p>
                  </CardContent>
                </Card>
              ))
          ) : (
            // Loading state with Skeletons
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
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
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
