"use client"
import { Navbar } from "@/components/navbar"
import { EmojiDisplay } from "@/components/emoji-display"
import { EmojiHistory } from "@/components/emoji-history"
import { EmojiCreatorForm } from "@/components/emoji-creator-form"
import { EmojiProvider } from "@/components/emoji-provider"

export default function EmojiGenerator() {
  return (
    <EmojiProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container max-w-4xl px-4 mx-auto flex-1 py-8">
          <div 
            className="flex flex-col items-center justify-center gap-8"
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              animation: 'fadeInUp 0.5s forwards'
            }}
          >
            <EmojiCreatorForm />
            <EmojiDisplay />
            <EmojiHistory />
          </div>
        </div>
        <footer className="py-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EmojiGen • AI-Powered Emoji Generator</p>
        </footer>
      </div>
    </EmojiProvider>
  )
} 