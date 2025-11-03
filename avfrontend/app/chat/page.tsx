'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text: input }])
    setInput('')
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: '🤖 This is an AI response!' }])
    }, 800)
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
        <h1 className="text-2xl font-semibold tracking-tight">Chat with AI</h1>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden rounded-2xl shadow-md backdrop-blur-sm bg-white/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-700/50">
        <CardContent className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-slate-400 mt-10">Start the conversation below 💬</p>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm px-3 py-2"
      >
        <Input
          type="text"
          placeholder="Ask anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-slate-900 dark:text-slate-100"
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
