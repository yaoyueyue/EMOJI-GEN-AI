"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Emoji } from "@/lib/supabase"

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
  emojis: Emoji[]
  isLoading: boolean
  error: string | null
  refreshEmojis: () => Promise<void>
  likeEmoji: (emojiId: string, like: boolean) => Promise<void>
}

// Create the context with a default value
const EmojiContext = createContext<EmojiContextType | undefined>(undefined)

// Provider component
export function EmojiProvider({ children }: { children: ReactNode }) {
  const [emojis, setEmojis] = useState<Emoji[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn, isLoaded } = useUser()

  const fetchEmojis = async () => {
    if (!isSignedIn) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/emoji/list")
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch emojis")
      }
      
      const data = await response.json()
      setEmojis(data.emojis || [])
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching emojis")
      console.error("Error fetching emojis:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch emojis when the component mounts or when the user signs in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchEmojis()
    }
  }, [isLoaded, isSignedIn])

  const likeEmoji = async (emojiId: string, like: boolean) => {
    if (!isSignedIn) return
    
    try {
      const response = await fetch("/api/emoji/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emojiId, like }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update like status")
      }
      
      // Update local state
      setEmojis(prevEmojis => 
        prevEmojis.map(emoji => 
          emoji.id === emojiId 
            ? { ...emoji, isFavorite: like }
            : emoji
        )
      )
    } catch (err: any) {
      console.error("Error liking emoji:", err)
    }
  }

  return (
    <EmojiContext.Provider
      value={{
        emojis,
        isLoading,
        error,
        refreshEmojis: fetchEmojis,
        likeEmoji,
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

