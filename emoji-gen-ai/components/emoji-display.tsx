"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Clipboard, Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEmoji } from "@/components/emoji-provider"
import { useToast } from "@/hooks/use-toast"

export function EmojiDisplay() {
  const { currentEmoji, toggleFavorite } = useEmoji()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!currentEmoji) return

    try {
      // In a real app, you would fetch the image and copy it
      // For now, we'll just simulate copying
      setCopied(true)
      toast({
        title: "Copied to clipboard! 📋",
        description: "Emoji has been copied to your clipboard",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy failed 😢",
        description: "Could not copy emoji to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (!currentEmoji) return

    // In a real app, you would download the actual image
    // For now, we'll just show a toast
    toast({
      title: "Download started! 🎉",
      description: "Your emoji is being downloaded",
    })
  }

  const handleFavorite = () => {
    if (!currentEmoji) return
    toggleFavorite(currentEmoji.id)

    toast({
      title: currentEmoji.isFavorite ? "Removed from favorites 💔" : "Added to favorites ❤️",
      description: currentEmoji.isFavorite
        ? "Emoji has been removed from your favorites"
        : "Emoji has been added to your favorites",
    })
  }

  return (
    <AnimatePresence mode="wait">
      {currentEmoji ? (
        <motion.div
          key="emoji-display"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="w-full max-w-md p-6 rounded-3xl bg-card shadow-lg border-2 border-primary/20"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-full">
              <span className="font-medium">Prompt:</span> {currentEmoji.prompt}
            </div>

            <motion.div
              className="relative w-56 h-56 bg-gradient-to-br from-accent/30 to-primary/20 rounded-2xl overflow-hidden shadow-inner p-2"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.img
                src={currentEmoji.imageUrl}
                alt={currentEmoji.prompt}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            </motion.div>

            <div className="flex gap-3 w-full justify-center mt-2">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownload}
                  className="rounded-full h-12 w-12 bg-secondary/10 border-2 border-secondary/30 text-secondary-foreground"
                >
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Download</span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className={`rounded-full h-12 w-12 ${copied ? "bg-accent/30 border-accent" : "bg-accent/10 border-2 border-accent/30"}`}
                >
                  <Clipboard className="h-5 w-5" />
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavorite}
                  className={`rounded-full h-12 w-12 ${currentEmoji.isFavorite ? "bg-primary/30 border-primary" : "bg-primary/10 border-2 border-primary/30"}`}
                >
                  <Heart className={`h-5 w-5 ${currentEmoji.isFavorite ? "fill-primary" : ""}`} />
                  <span className="sr-only">Favorite</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="emoji-placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-accent/10 to-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center"
          style={{ minHeight: "320px" }}
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <div className="bg-primary/10 p-4 rounded-full inline-block">
                <Sparkles className="h-12 w-12 text-primary/70" />
              </div>
            </motion.div>
            <h3 className="text-xl font-medium text-foreground">Your emoji will appear here</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Enter a description and click "Make My Emoji" to generate something magical! ✨
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

