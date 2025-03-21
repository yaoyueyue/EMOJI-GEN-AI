"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, History, Download, Clipboard, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmoji } from "@/components/emoji-provider"
import { useToast } from "@/hooks/use-toast"

export function EmojiHistory() {
  const { emojiHistory, currentEmoji, setCurrentEmoji, toggleFavorite } = useEmoji()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 200
    const currentScroll = scrollContainerRef.current.scrollLeft

    scrollContainerRef.current.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  const handleCopy = async (emoji: any) => {
    try {
      // Fetch the image
      const response = await fetch(emoji.imageUrl)
      const blob = await response.blob()
      
      // Create a ClipboardItem with the image
      const item = new ClipboardItem({
        [blob.type]: blob
      })
      
      // Copy to clipboard
      await navigator.clipboard.write([item])
      
      toast({
        title: "Image copied to clipboard! 📋",
        description: "You can now paste the emoji in other applications",
      })
    } catch (error) {
      console.error('Copy error:', error)
      toast({
        title: "Failed to copy image 😢",
        description: "Your browser may not support copying images or the feature might be restricted",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async (emoji: any) => {
    if (!emoji) return
    
    try {
      // Fetch the image
      const response = await fetch(emoji.imageUrl)
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      // Set the filename
      const filename = `emoji-${emoji.prompt.replace(/\s+/g, '-').toLowerCase()}.png`
      a.download = filename
      
      // Trigger the download
      document.body.appendChild(a)
      a.click()
      
      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast({
        title: "Download complete! 🎉",
        description: "Your emoji has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Download failed 😢",
        description: "Could not download the emoji",
        variant: "destructive",
      })
    }
  }

  if (emojiHistory.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center p-8 bg-purple-50/50 rounded-lg">
        <History className="w-10 h-10 text-purple-200 mx-auto mb-2" />
        <p className="text-purple-400">No emojis created yet</p>
        <p className="text-sm text-purple-300 mt-1">Enter a prompt above to create your first emoji!</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 bg-transparent px-3 py-1 rounded-full">
          <History className="h-4 w-4 text-purple-300" />
          <h3 className="text-sm font-medium text-purple-300">Your Emoji Collection</h3>
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
              className="h-8 w-8 rounded-full text-purple-300 hover:text-purple-400 hover:bg-transparent"
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
              className="h-8 w-8 rounded-full text-purple-300 hover:text-purple-400 hover:bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {emojiHistory.map((emoji, index) => (
          <div
            key={emoji.id}
            className={`relative w-32 h-32 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 snap-start hover:scale-105 transition-transform`}
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
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/60 to-purple-500/60 flex items-center justify-center gap-2 transition-opacity duration-300 ease-in-out backdrop-blur-sm">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 bg-white/30 hover:bg-white/50 border-0" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(emoji);
                  }}
                >
                  <Download className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 bg-white/30 hover:bg-white/50 border-0" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(emoji);
                  }}
                >
                  <Clipboard className="h-4 w-4 text-white" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  className={`h-8 w-8 p-0 ${emoji.isFavorite ? 'bg-pink-400/50 hover:bg-pink-400/70' : 'bg-white/30 hover:bg-white/50'} border-0`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(emoji.id);
                  }}
                >
                  <Heart className={`h-4 w-4 text-white ${emoji.isFavorite ? "fill-white" : ""}`} />
                </Button>
              </div>
            )}
            
            {emoji.isFavorite && !hoveredId && (
              <div className="absolute top-1 right-1 text-pink-500 text-xs">❤️</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

