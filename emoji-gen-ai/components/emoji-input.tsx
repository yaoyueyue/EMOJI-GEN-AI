"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEmoji } from "@/components/emoji-provider"

const PROMPT_SUGGESTIONS = [
  "A panda with sunglasses",
  "A happy pizza slice",
  "A crying cloud",
  "A dancing cactus",
  "A sleepy moon",
  "A robot eating ice cream",
  "A cat wearing a party hat",
  "A smiling rainbow",
]

export function EmojiInput() {
  const { currentPrompt, setCurrentPrompt, isGenerating, generateEmoji } = useEmoji()
  const [suggestion, setSuggestion] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)
      setSuggestion(PROMPT_SUGGESTIONS[randomIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    generateEmoji(currentPrompt)
  }

  const handleSuggestionClick = () => {
    setCurrentPrompt(suggestion)
    generateEmoji(suggestion)
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="prompt" className="text-lg font-medium flex items-center gap-2">
            <span>Describe your emoji</span>
            <span className="text-xl">🎨</span>
          </label>
          <Input
            id="prompt"
            value={currentPrompt}
            onChange={(e) => setCurrentPrompt(e.target.value)}
            placeholder="e.g., A panda with sunglasses"
            className="h-14 px-5 text-base rounded-2xl border-2 border-primary/20 focus:border-primary/40 shadow-sm"
            disabled={isGenerating}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              className="w-full h-14 text-base rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-md border-0"
              disabled={!currentPrompt.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  <span>Magic happening...</span>
                </>
              ) : (
                <>
                  <span className="mr-2 text-xl">🔥</span>
                  <span>Make My Emoji</span>
                </>
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 text-base rounded-2xl border-2 border-accent/50 bg-accent/10 text-foreground hover:bg-accent/20"
              onClick={handleSuggestionClick}
              disabled={isGenerating}
            >
              <span className="mr-2">✨</span>
              Try: {suggestion}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  )
}

