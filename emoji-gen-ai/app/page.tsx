import Image from "next/image"
import { Button } from "@/components/ui/button"
import { EmojiHistory } from "@/components/emoji-history"
import { EmojiCreatorForm } from "@/components/emoji-creator-form"
import { EmojiProvider } from "@/components/emoji-provider"
import { AuthButtons } from "@/components/auth-buttons"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/30 to-blue-50/20 relative overflow-hidden">
      {/* Minimal Header */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Sparkle emoji with color matching EmojiGen */}
          <span className="text-lg" style={{ color: "#e779c1" }}>
            ✨
          </span>
          {/* Darker EmojiGen without sparkle on right */}
          <span className="font-bold bg-gradient-to-r from-rose-400 to-purple-400 text-transparent bg-clip-text">
            EmojiGen AI
          </span>
        </div>
        {/* Auth Buttons */}
        <AuthButtons />
      </header>

      <EmojiProvider>
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-transparent bg-clip-text">
                AI Emoji Magic
              </span>
            </h1>

            <div className="flex flex-col gap-6 items-center">
              <EmojiCreatorForm />
              <EmojiHistory />
            </div>
          </div>
        </section>
      </EmojiProvider>
    </div>
  )
}

