"use client"

import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

interface CreateEmojiButtonProps {
  onCreateEmoji: (prompt: string) => void
}

export function CreateEmojiButton({ onCreateEmoji }: CreateEmojiButtonProps) {
  const handleClick = () => {
    console.log("Button clicked")
    const promptElement = document.querySelector('input[placeholder="Describe your emoji..."]') as HTMLInputElement
    const prompt = promptElement?.value
    console.log("Prompt value:", prompt)
    
    if (prompt) {
      onCreateEmoji(prompt)
    } else {
      console.log("No prompt value found")
    }
  }

  return (
    <Button 
      className="w-full mt-3 h-14 bg-gradient-to-r from-pink-300/80 to-purple-300/80 hover:from-pink-300 hover:to-purple-300 rounded-xl text-white border-0"
      onClick={handleClick}
    >
      <Zap className="mr-2 h-4 w-4" />
      Create Emoji
    </Button>
  )
} 