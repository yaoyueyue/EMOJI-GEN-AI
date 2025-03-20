import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "../components/theme-provider"
import { Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="emojigen-theme">
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

        {/* Focused Hero */}
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-lg mx-auto">
            {/* Title without emoji after Magic */}
            <h1 className="text-3xl font-bold mb-8">
              <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 text-transparent bg-clip-text">
                AI Emoji Magic
              </span>
            </h1>

            {/* Taller Input Area */}
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Describe your emoji..."
                className="w-full h-24 px-5 rounded-xl border border-blue-100/80 focus:border-blue-200/80 outline-none text-gray-600 shadow-sm text-lg"
              />
              {/* Try button in corner - matching color scheme */}
              <div className="absolute right-3 top-3 bg-purple-100/50 text-purple-300 px-3 py-1 rounded-full text-xs">
                Try: "Happy pizza"
              </div>
              <Button className="w-full mt-3 h-14 bg-gradient-to-r from-pink-300/80 to-purple-300/80 hover:from-pink-300 hover:to-purple-300 rounded-xl text-white border-0">
                <Zap className="mr-2 h-4 w-4" />
                Create Emoji
              </Button>
            </div>

            {/* Larger Previously Created Area */}
            <div className="mt-12">
              <div className="flex items-center justify-center mb-3">
                <div className="h-px w-16 bg-purple-100"></div>
                <span className="mx-3 text-xs text-purple-300">Recently Created</span>
                <div className="h-px w-16 bg-purple-100"></div>
              </div>

              <div className="flex justify-center gap-5 overflow-x-auto pb-4 max-w-lg mx-auto">
                {[
                  { bg: "bg-gradient-to-br from-pink-100/50 to-pink-200/30" },
                  { bg: "bg-gradient-to-br from-purple-100/50 to-purple-200/30" },
                  { bg: "bg-gradient-to-br from-blue-100/50 to-blue-200/30" },
                  { bg: "bg-gradient-to-br from-purple-100/50 to-pink-100/30" },
                  { bg: "bg-gradient-to-br from-pink-100/50 to-purple-100/30" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 rounded-xl ${item.bg} flex items-center justify-center shadow-sm border border-purple-100/30`}
                  >
                    <Image src={`/placeholder.svg?height=50&width=50&text=😀`} alt="Example" width={50} height={50} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </ThemeProvider>
  )
}

