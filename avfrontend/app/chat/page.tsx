// app/chat/page.tsx
'use client'

import Link from 'next/link' // 1. Import Link
import { Button } from '@/components/ui/button' // 2. Import Button
import { ArrowLeft } from 'lucide-react' // 3. Import an icon

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen p-4">
      {/* 4. Add this new header section */}
      <div className="flex items-center gap-4 mb-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Home</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Chat with AI</h1>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 border rounded-lg p-4 mb-4 overflow-y-auto">
        {/* Chat messages will go here */}
        <p className="text-muted-foreground">Chat interface goes here...</p>
      </div>

      {/* Chat input */}
      <form className="flex gap-2">
        <input
          type="text"
          placeholder="Ask anything..."
          className="flex-1 p-2 border rounded-lg"
        />
        <Button
          type="submit"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Send
        </Button>
      </form>
    </div>
  )
}