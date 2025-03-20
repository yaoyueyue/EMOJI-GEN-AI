"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Emoji = {
  id: string
  prompt: string
  imageUrl: string
  createdAt: Date
  isFavorite: boolean
}

type EmojiContextType = {
  currentPrompt: string
  setCurrentPrompt: (prompt: string) => void
  isGenerating: boolean
  setIsGenerating: (isGenerating: boolean) => void
  currentEmoji: Emoji | null
  setCurrentEmoji: (emoji: Emoji | null) => void
  emojiHistory: Emoji[]
  addToHistory: (emoji: Emoji) => void
  toggleFavorite: (id: string) => void
  generateEmoji: (prompt: string) => Promise<void>
}

const EmojiContext = createContext<EmojiContextType | undefined>(undefined)

// Sample emoji backgrounds for the mock generator
const EMOJI_BACKGROUNDS = [
  "from-pink-200 to-yellow-200",
  "from-green-200 to-blue-200",
  "from-purple-200 to-pink-200",
  "from-yellow-200 to-orange-200",
  "from-blue-200 to-teal-200",
]

export function EmojiProvider({ children }: { children: ReactNode }) {
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentEmoji, setCurrentEmoji] = useState<Emoji | null>(null)
  const [emojiHistory, setEmojiHistory] = useState<Emoji[]>([])

  // Mock emoji generation function (to be replaced with actual Replicate API)
  const generateEmoji = async (prompt: string) => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setCurrentPrompt(prompt)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Get a random emoji for the mock
      const emojiOptions = ["😀", "🎉", "🚀", "🌈", "🍕", "🐱", "🌟", "🦄", "🍦", "🎮"]
      const randomEmoji = emojiOptions[Math.floor(Math.random() * emojiOptions.length)]

      // Create a placeholder URL with the emoji and a random background
      const randomBg = EMOJI_BACKGROUNDS[Math.floor(Math.random() * EMOJI_BACKGROUNDS.length)]
      const placeholderUrl = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(randomEmoji)}`

      // Mock response - in a real app, this would be the response from Replicate
      const newEmoji: Emoji = {
        id: Date.now().toString(),
        prompt,
        imageUrl: placeholderUrl,
        createdAt: new Date(),
        isFavorite: false,
      }

      setCurrentEmoji(newEmoji)
      addToHistory(newEmoji)
    } catch (error) {
      console.error("Error generating emoji:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const addToHistory = (emoji: Emoji) => {
    setEmojiHistory((prev) => [emoji, ...prev.slice(0, 19)]) // Keep only the 20 most recent
  }

  const toggleFavorite = (id: string) => {
    setEmojiHistory((prev) =>
      prev.map((emoji) => (emoji.id === id ? { ...emoji, isFavorite: !emoji.isFavorite } : emoji)),
    )

    if (currentEmoji?.id === id) {
      setCurrentEmoji((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null))
    }
  }

  return (
    <EmojiContext.Provider
      value={{
        currentPrompt,
        setCurrentPrompt,
        isGenerating,
        setIsGenerating,
        currentEmoji,
        setCurrentEmoji,
        emojiHistory,
        addToHistory,
        toggleFavorite,
        generateEmoji,
      }}
    >
      {children}
    </EmojiContext.Provider>
  )
}

export function useEmoji() {
  const context = useContext(EmojiContext)
  if (context === undefined) {
    throw new Error("useEmoji must be used within an EmojiProvider")
  }
  return context
}

