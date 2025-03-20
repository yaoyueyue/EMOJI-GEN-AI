"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmoji } from "@/components/emoji-provider"

export function EmojiHistory() {
  const { emojiHistory, setCurrentEmoji } = useEmoji()
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
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              className="h-8 w-8 rounded-full bg-accent/10"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              className="h-8 w-8 rounded-full bg-accent/10"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </motion.div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {emojiHistory.map((emoji, index) => (
          <motion.div
            key={emoji.id}
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: "spring" }}
            whileHover={{ scale: 1.1, y: -5 }}
            className="flex-shrink-0 snap-start"
          >
            <button
              onClick={() => setCurrentEmoji(emoji)}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-colors shadow-sm"
            >
              <img
                src={emoji.imageUrl || "/placeholder.svg"}
                alt={emoji.prompt}
                className="w-full h-full object-contain p-1"
              />
            </button>
            {emoji.isFavorite && (
              <div className="flex justify-center mt-1">
                <span className="text-xs">❤️</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

