"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Clipboard, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmoji } from "@/components/emoji-provider"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function EmojiDisplay() {
  const { currentEmoji, toggleFavorite } = useEmoji()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  
  // Log when current emoji changes
  useEffect(() => {
    console.log("EmojiDisplay currentEmoji:", currentEmoji)
  }, [currentEmoji])

  const handleCopy = async () => {
    if (!currentEmoji) return

    try {
      await navigator.clipboard.writeText(currentEmoji.prompt)
      setCopied(true)
      toast({
        title: "Copied to clipboard! 📋",
        description: currentEmoji.prompt,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Failed to copy 😢",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = async () => {
    if (!currentEmoji) return
    
    try {
      // Fetch the image
      const response = await fetch(currentEmoji.imageUrl)
      const blob = await response.blob()
      
      // Create a download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      // Set the filename
      const filename = `emoji-${currentEmoji.prompt.replace(/\s+/g, '-').toLowerCase()}.png`
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

  console.log("Rendering EmojiDisplay with:", 
    currentEmoji ? {
      id: currentEmoji.id,
      prompt: currentEmoji.prompt,
      imageUrl: currentEmoji.imageUrl
    } : 'null')
  
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h2>Emoji Display</h2>
      
      {/* Image container with relative positioning */}
      <div className="relative group">
        {/* The emoji image */}
        <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
          {currentEmoji ? (
            <Image 
              src={currentEmoji.imageUrl}
              alt={currentEmoji.prompt}
              width={200}
              height={200}
              className="object-contain"
            />
          ) : (
            <div className="text-gray-300">No emoji generated</div>
          )}
        </div>
        
        {/* Overlay buttons that appear on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={handleCopy}>
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant={currentEmoji?.isFavorite ? "default" : "outline"}
            onClick={() => currentEmoji?.id && toggleFavorite(currentEmoji.id)}
          >
            <Heart className={`h-4 w-4 ${currentEmoji?.isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}

