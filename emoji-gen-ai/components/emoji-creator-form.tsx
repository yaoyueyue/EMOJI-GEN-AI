"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export function EmojiCreatorForm() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState("")
  const { isSignedIn } = useUser()

  async function handleGenerateEmoji(e: React.FormEvent) {
    e.preventDefault()
    
    if (!isSignedIn) {
      setError("Please sign in to generate emojis")
      return
    }
    
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }
    
    setError("")
    setIsGenerating(true)
    
    try {
      const response = await fetch("/api/emoji/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate emoji")
      }
      
      // If successful, clear the prompt and refresh emojis (handled by parent context)
      setPrompt("")
    } catch (err: any) {
      setError(err.message || "An error occurred while generating the emoji")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={handleGenerateEmoji} className="w-full space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a prompt to generate an emoji..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            disabled={isGenerating || !prompt.trim() || !isSignedIn}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        <div className="text-xs text-gray-500">
          Examples: "a happy cat", "a robot dancing", "a taco with sunglasses"
        </div>
      </div>
    </form>
  )
} 