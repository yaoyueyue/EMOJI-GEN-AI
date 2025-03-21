"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight, History, Download, Clipboard, Heart, Copy, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmoji } from "@/components/emoji-provider"
import { useToast } from "@/hooks/use-toast"
import { useUser } from "@clerk/nextjs"
import Image from "next/image"

export function EmojiHistory() {
  const { emojis, isLoading, error, likeEmoji } = useEmoji()
  const { isSignedIn } = useUser()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 200
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  const handleCopy = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleDownload = (url: string, prompt: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = `emoji-${prompt.replace(/\s+/g, "-").substring(0, 20)}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isSignedIn) {
    return (
      <div className="w-full text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Please sign in to view your emoji history</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (emojis.length === 0) {
    return (
      <div className="w-full text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">You haven't generated any emojis yet</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Your Emojis</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {emojis.map((emoji) => (
          <div 
            key={emoji.id} 
            className="relative group bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src={emoji.url}
                alt={emoji.prompt}
                fill
                className="object-cover"
              />
              
              {/* Overlay with buttons on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={() => handleDownload(emoji.url, emoji.prompt)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className={`h-8 w-8 bg-white/80 hover:bg-white ${
                    emoji.likes_num > 0 ? "text-red-500" : ""
                  }`}
                  onClick={() => likeEmoji(emoji.id, emoji.likes_num === 0)}
                  title={emoji.likes_num > 0 ? "Unlike" : "Like"}
                >
                  <Heart className="h-4 w-4" fill={emoji.likes_num > 0 ? "currentColor" : "none"} />
                </Button>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={() => handleCopy(emoji.url, emoji.id)}
                  title="Copy URL"
                >
                  {copiedId === emoji.id ? (
                    <span className="text-xs font-medium">Copied!</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <p className="mt-2 text-xs text-gray-500 truncate" title={emoji.prompt}>
              {emoji.prompt}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

