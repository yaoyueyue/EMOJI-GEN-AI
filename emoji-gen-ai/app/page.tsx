import Image from "next/image"
import { Button } from "@/components/ui/button"
import { EmojiDisplay } from "@/components/emoji-display"
import { EmojiHistory } from "@/components/emoji-history"
import { EmojiCreatorForm } from "@/components/emoji-creator-form"
import { EmojiProvider } from "@/components/emoji-provider"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-blue-50/20">
      {/* Minimal Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Sparkle emoji with color matching EmojiGen */}
          <span className="text-lg" style={{ color: "#e779c1" }}>
            ✨
          </span>
          {/* Darker EmojiGen without sparkle on right */}
          <span className="font-bold bg-gradient-to-r from-rose-400 to-purple-400 text-transparent bg-clip-text">
            EmojiGen
          </span>
        </div>
        {/* Lighter login/signup text */}
        <Button
          variant="ghost"
          className="text-purple-300 hover:text-purple-400 hover:bg-transparent rounded-full px-4 py-1 h-8 text-sm font-medium"
        >
          Login / Sign Up
        </Button>
      </header>

      <EmojiProvider>
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-transparent bg-clip-text">
                AI Emoji Magic
              </span>
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <EmojiCreatorForm />
              </div>
              
              <div>
                <EmojiDisplay />
              </div>
            </div>
            
            <div className="mt-8">
              <EmojiHistory />
            </div>
          </div>
        </section>
      </EmojiProvider>
    </div>
  )
}

