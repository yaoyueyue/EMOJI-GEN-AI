"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

// Define the emoji type
export interface Emoji {
  id: string
  prompt: string
  imageUrl: string
  createdAt: Date
  isFavorite: boolean
}

// Define the context type with all required functions
export interface EmojiContextType {
  emojiHistory: Emoji[]
  currentEmoji: Emoji | null
  setCurrentEmoji: (emoji: Emoji) => void
  addEmoji: (emoji: Emoji) => void  // Make sure this is defined
  toggleFavorite: (id: string) => void
}

// Create the context with a default value
const EmojiContext = createContext<EmojiContextType | undefined>(undefined)

// Provider component
export function EmojiProvider({ children }: { children: ReactNode }) {
  const [emojiHistory, setEmojiHistory] = useState<Emoji[]>([])
  const [currentEmoji, setCurrentEmoji] = useState<Emoji | null>(null)

  // Add a new emoji to the history
  const addEmoji = (emoji: Emoji) => {
    setEmojiHistory(prev => [emoji, ...prev])
    setCurrentEmoji(emoji)
  }

  // Toggle favorite status for an emoji
  const toggleFavorite = (id: string) => {
    setEmojiHistory(prev => 
      prev.map(emoji => 
        emoji.id === id 
          ? { ...emoji, isFavorite: !emoji.isFavorite } 
          : emoji
      )
    )
    
    if (currentEmoji && currentEmoji.id === id) {
      setCurrentEmoji({
        ...currentEmoji,
        isFavorite: !currentEmoji.isFavorite
      })
    }
  }

  return (
    <EmojiContext.Provider
      value={{
        emojiHistory,
        currentEmoji,
        setCurrentEmoji,
        addEmoji,
        toggleFavorite,
      }}
    >
      {children}
    </EmojiContext.Provider>
  )
}

// Custom hook to use the emoji context
export function useEmoji() {
  const context = useContext(EmojiContext)
  if (context === undefined) {
    throw new Error("useEmoji must be used within an EmojiProvider")
  }
  return context
}

