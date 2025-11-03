// app/api/chat/route.ts
import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json({ reply: 'No messages provided' })
    }

    const model = genAI.getGenerativeModel({ model: 'text-bison-001' })

    // Combine messages into a single prompt string
    const prompt = messages
      .map((m: any) => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`)
      .join('\n')

    const result = await model.generateContent(prompt)
    const reply = result.response?.text() || 'No response from Gemini'

    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json(
      { reply: '⚠️ Error getting response', error: err.message },
      { status: 500 }
    )
  }
}
