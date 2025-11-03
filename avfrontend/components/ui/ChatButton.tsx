import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Link from "next/link" // 1. Import Link

export function ChatButton() {
  return (
    <Button
      asChild // 2. Add the asChild prop
      size="icon"
      className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50" // z-50 ensures it's on top
    >
      <Link href="/chat"> {/* 3. Wrap the icon in the Link */}
        <MessageCircle className="h-6 w-6" />
      </Link>
    </Button>
  )
}