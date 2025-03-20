import { NextResponse } from "next/server"
import Replicate from "replicate"

export async function POST(request: Request) {
  try {
    // Check for API token
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error("Missing REPLICATE_API_TOKEN environment variable")
      return NextResponse.json(
        { error: "Missing API token - please configure REPLICATE_API_TOKEN" },
        { status: 500 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { prompt } = body
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      )
    }

    console.log("Processing prompt:", prompt)

    // Initialize Replicate with the API token
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    })

    // Call Replicate API to generate emoji
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          prompt: prompt,
          negative_prompt: "ugly, deformed, noisy, blurry, distorted, text, watermark, username, badly drawn face",
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 25,
        }
      }
    )

    console.log("Replicate raw output:", output)
    
    // Extract the URL from the response properly
    let imageUrl = null;

    if (Array.isArray(output) && output.length > 0) {
      const firstOutput = output[0];
      // Check if it's a FileOutput object with a url method
      if (firstOutput && typeof firstOutput.url === 'function') {
        try {
          // Call the url method to get the URL object
          const urlObject = await firstOutput.url();
          
          // Handle both string and URL object responses
          if (typeof urlObject === 'string') {
            imageUrl = urlObject;
          } else if (urlObject && typeof urlObject === 'object' && urlObject.href) {
            // Extract the href property from the URL object
            imageUrl = urlObject.href;
            console.log("Extracted href from URL object:", imageUrl);
          }
        } catch (err) {
          console.error("Failed to call url() method:", err);
        }
      } else if (typeof firstOutput === 'string') {
        imageUrl = firstOutput;
      }
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else if (output && typeof output === 'object') {
      console.log("Object output type:", JSON.stringify(output, null, 2));
    }

    // Make absolutely sure it's a string
    if (typeof imageUrl !== 'string') {
      console.error("Could not extract URL:", imageUrl);
      return NextResponse.json(
        { error: "Failed to extract image URL from generation result" },
        { status: 500 }
      );
    }
    
    // Return a proper string URL
    return NextResponse.json({ 
      imageUrl: imageUrl,
      prompt: prompt,
      success: !!imageUrl
    });
    
  } catch (error) {
    console.error("Error in generate-emoji API route:", error)
    
    // Detailed error for debugging
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 