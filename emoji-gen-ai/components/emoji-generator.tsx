"use client"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { EmojiDisplay } from "@/components/emoji-display"
import { EmojiHistory } from "@/components/emoji-history"
import { EmojiInput } from "@/components/emoji-input"
import { EmojiProvider } from "@/components/emoji-provider"

export default function EmojiGenerator() {
  return (
    <EmojiProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container max-w-4xl px-4 mx-auto flex-1 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            <EmojiInput />
            <EmojiDisplay />
            <EmojiHistory />
          </motion.div>
        </div>
        <footer className="py-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EmojiGen • AI-Powered Emoji Generator</p>
        </footer>
      </div>
    </EmojiProvider>
  )
}

