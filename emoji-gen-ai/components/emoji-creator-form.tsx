"use client"

import { Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { useEmoji } from "@/components/emoji-provider"

// Array of fun emoji prompt suggestions
const PROMPT_SUGGESTIONS = [
  "Happy pizza",
  "Crying cloud",
  "Dancing avocado",
  "Sleepy cat",
  "Excited robot",
  "Surprised donut",
  "Laughing taco",
  "Grumpy coffee",
  "Loving planet",
  "Confused banana"
]

export function EmojiCreatorForm() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { addEmoji, setCurrentEmoji } = useEmoji()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [examplePrompt, setExamplePrompt] = useState("Happy pizza")
  const inputRef = useRef<HTMLInputElement>(null)

  // Get a random prompt on initial load
  useEffect(() => {
    setExamplePrompt(getRandomPrompt())
  }, [])

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)
    return PROMPT_SUGGESTIONS[randomIndex]
  }

  const handleCreateEmoji = async (customPrompt?: string) => {
    const userPrompt = customPrompt || prompt
    
    // Log the actual prompt being used
    console.log("User prompt value:", userPrompt)
    console.log("Input field current value:", inputRef.current?.value)
    
    if (!userPrompt) {
      setErrorMessage("Please enter a prompt description")
      console.log("No prompt value found")
      return
    }

    // Don't modify the user's prompt for logging purposes
    console.log("Sending emoji generation request for:", userPrompt)
    
    setIsLoading(true)
    setErrorMessage(null)
    
    try {
      // Get the current origin for absolute URL construction
      const origin = window.location.origin
      
      // Log the actual request
      const requestBody = {
        prompt: userPrompt,
        width: 1024,
        height: 1024,
        refine: "no_refiner",
        scheduler: "K_EULER",
        lora_scale: 0.6,
        num_outputs: 1,
        guidance_scale: 7.5,
        apply_watermark: false,
        high_noise_frac: 0.8,
        negative_prompt: "",
        prompt_strength: 0.8,
        num_inference_steps: 50
      }
      
      console.log("Sending request with body:", JSON.stringify(requestBody))
      
      // Use the real emoji generation API with enhanced prompt and additional parameters
      const res = await fetch(`${origin}/api/generate-emoji`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })
      
      console.log("API response status:", res.status)
      
      // Check if response is OK
      if (!res.ok) {
        const errorText = await res.text()
        console.error(`API error (${res.status}):`, errorText)
        throw new Error(`API returned status ${res.status}`)
      }
      
      // Try to parse as JSON with error handling
      let data
      try {
        const text = await res.text()
        console.log("Raw response:", text)
        
        if (!text) {
          throw new Error("Empty response from API")
        }
        
        data = JSON.parse(text)
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError)
        throw new Error("Invalid JSON response from API")
      }
      
      console.log('API Response data:', data)

      let imageUrl = null

      if (data.imageUrl && typeof data.imageUrl === 'string') {
        imageUrl = data.imageUrl
      } else if (data.output && Array.isArray(data.output) && data.output.length > 0) {
        // Some APIs return { output: ["url"] } format
        imageUrl = data.output[0]
      }

      console.log('Extracted imageUrl:', imageUrl)

      if (imageUrl) {
        // Create new emoji object with the ORIGINAL prompt (not enhanced)
        const newEmoji = {
          id: Date.now().toString(),
          prompt: userPrompt, // Store original prompt for display
          imageUrl: imageUrl,
          createdAt: new Date(),
          isFavorite: false
        }
        
        // Add to emoji history and set as current emoji
        if (addEmoji) {
          addEmoji(newEmoji)
          setCurrentEmoji(newEmoji)
        }
        
        setPrompt("") // Clear the prompt after successful generation
      } else {
        setErrorMessage("API response didn't contain a valid image URL")
      }
    } catch (err) {
      console.error('Error:', err)
      
      // Check if it's an NSFW error from the response
      let errorMsg = 'Unknown error'
      
      if (err instanceof Error) {
        errorMsg = err.message
        
        // Check if the error message contains NSFW or content policy info
        if (errorMsg.includes('NSFW') || errorMsg.includes('content')) {
          errorMsg = "We can't generate this image due to content safety filters. Please try a different prompt."
        }
      }
      
      setErrorMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = () => {
    const randomPrompt = getRandomPrompt()
    setExamplePrompt(randomPrompt) // Update the displayed prompt
    setPrompt(randomPrompt) // Set the input field
    handleCreateEmoji(randomPrompt) // Generate emoji with this prompt
  }

  return (
    <div className="w-full max-w-2xl mb-4 relative">
      <input
        ref={inputRef}
        type="text"
        placeholder="Describe your emoji..."
        className="w-full h-48 px-5 rounded-xl border border-blue-100/80 focus:border-blue-200/80 outline-none text-gray-600 shadow-sm text-lg"
        value={prompt}
        onChange={(e) => {
          console.log("Input changed:", e.target.value)
          setPrompt(e.target.value)
        }}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleCreateEmoji()
          }
        }}
      />
      
      <Button 
        onClick={handleExampleClick}
        variant="ghost" 
        size="sm"
        className="absolute right-3 top-3 bg-purple-100/50 hover:bg-purple-200/60 text-purple-400 hover:text-purple-500 px-3 py-1 rounded-full text-xs h-auto"
        disabled={isLoading}
      >
        <Sparkles className="h-3 w-3 mr-1" />
        Try: "{examplePrompt}"
      </Button>
      
      {errorMessage && (
        <div className="mt-2 text-sm text-red-500">
          Error: {errorMessage}
        </div>
      )}
      
      <Button 
        className="w-full mt-3 h-14 bg-gradient-to-r from-pink-300/80 to-purple-300/80 hover:from-pink-300 hover:to-purple-300 rounded-xl text-white border-0"
        onClick={() => handleCreateEmoji()}
        disabled={isLoading}
      >
        <Zap className="mr-2 h-4 w-4" />
        {isLoading ? "Generating AI Emoji..." : "Create Emoji"}
      </Button>
    </div>
  )
} 