// components/ui/ConditionalChatButton.tsx
'use client' 

import { usePathname } from 'next/navigation'
import { ChatButton } from './ChatButton' // Import your original button

export function ConditionalChatButton() {
  const pathname = usePathname()

  // If we are on the chat page, don't render anything
  if (pathname === '/chat') {
    return null
  }

  // On all other pages, show the button
  return <ChatButton />
}