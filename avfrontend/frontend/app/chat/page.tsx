'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

// Define a type for messages
type Message = { role: 'user' | 'assistant'; text: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user's message
    const newMessage: Message = { role: 'user', text: input }
    const newMessages = [...messages, newMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      // Call FastAPI RAG backend
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input }),
      })

      const data = await res.json()

      const assistantMessage: Message = {
        role: 'assistant',
        text: data.answer ?? 'No response from RAG backend',
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error(err)
      const errorMessage: Message = {
        role: 'assistant',
        text: '⚠️ Error fetching response.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button asChild variant="ghost" size="icon" className="rounded-full shadow-sm">
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to Home</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Chat with DeepSeek</h1>
      </div>

      {/* Chat */}
      <Card className="flex-1 flex flex-col overflow-hidden rounded-2xl shadow-md backdrop-blur-sm bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/50">
        <CardContent className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">Start the conversation below 💬</p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {loading && <div className="text-slate-400 text-sm italic">DeepSeek is thinking...</div>}
        </CardContent>
      </Card>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm px-3 py-2"
      >
        <Input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 dark:text-slate-100"
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
