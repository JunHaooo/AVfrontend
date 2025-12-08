// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { reply: 'No messages provided' },
        { status: 400 }
      )
    }

    // Transform messages for DeepSeek/OpenAI compatible API
    const formattedMessages = messages.map((m: { role: string; text: string }) => ({
        role: m.role === 'AI' ? 'assistant' : m.role,
        content: m.text,
    }));

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: formattedMessages,
      }),
    })

    const data = await response.json()
    const reply =
      data.choices?.[0]?.message?.content || 'No response from DeepSeek'

    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json(
      { reply: '⚠️ Error getting response', error: err.message },
      { status: 500 }
    )
  }
}
