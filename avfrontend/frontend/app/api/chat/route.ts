// app/api/chat/route.ts
import { NextResponse } from 'next/server'

// Define type for a message
type Message = {
  role: 'user' | 'assistant' | 'system'
  text: string
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json() as { messages: Message[] }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { reply: 'No messages provided' },
        { status: 400 }
      )
    }

    // Use the last user message as the question
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
    if (!lastUserMessage) {
      return NextResponse.json({ reply: 'No user message found' }, { status: 400 })
    }

    // Send question to FastAPI backend
    const response = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: lastUserMessage.text }),
    })

    const data = await response.json()

    // Return answer and optionally sources
    return NextResponse.json({
      reply: data.answer,
      sources: data.sources ?? [],
    })
  } catch (err) {
    console.error('API error:', err)
    let errorMessage = 'An unknown error occurred'
    if (err instanceof Error) errorMessage = err.message
    return NextResponse.json(
      { reply: '⚠️ Error getting response', error: errorMessage },
      { status: 500 }
    )
  }
}
