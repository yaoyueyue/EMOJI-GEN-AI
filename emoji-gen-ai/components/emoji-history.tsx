"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmoji } from "@/components/emoji-provider"

export function EmojiHistory() {
  const { emojiHistory, currentEmoji, setCurrentEmoji } = useEmoji()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 200
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  if (emojiHistory.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
          <History className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Recent Creations</h3>
        </div>

        <div className="flex gap-1">
          <div 
            className="hover:scale-110 active:scale-90 transition"
            style={{ transformOrigin: 'center' }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="h-8 w-8 rounded-full bg-accent/10"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>
          </div>
          <div 
            className="hover:scale-110 active:scale-90 transition"
            style={{ transformOrigin: 'center' }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="h-8 w-8 rounded-full bg-accent/10"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {emojiHistory.map((emoji, index) => (
          <div
            key={emoji.id}
            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 flex-shrink-0 snap-start ${
              currentEmoji?.id === emoji.id ? "border-primary" : "border-transparent"
            } hover:scale-105 transition-transform`}
            style={{
              opacity: 0,
              scale: 0.8,
              animation: `fadeIn 0.5s forwards ${index * 0.1}s, scaleIn 0.5s forwards ${index * 0.1}s`,
              transformOrigin: 'center'
            }}
            onMouseEnter={() => setHoveredId(emoji.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setCurrentEmoji(emoji)}
          >
            <img 
              src={emoji.imageUrl || "/placeholder.svg"} 
              alt={emoji.prompt}
              className="w-full h-full object-cover"
            />
            
            {hoveredId === emoji.id && (
              <div
                className="absolute inset-0 bg-black/40 flex items-center justify-center p-2"
                style={{
                  opacity: 0,
                  animation: 'fadeIn 0.3s forwards',
                }}
              >
                <p className="text-white text-xs text-center line-clamp-3">
                  {emoji.prompt}
                </p>
              </div>
            )}
            
            {emoji.isFavorite && (
              <div className="absolute top-2 right-2 text-xs">❤️</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

