import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: NextRequest) {
  console.log("API ROUTE CALLED");

  try {
    const body = await req.json();
    console.log("RECEIVED REQUEST:", JSON.stringify(body, null, 2));
    
    const prompt = body.prompt || "";
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    
    console.log("Processing prompt:", prompt);
    
    // Initialize Replicate
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
    
    // Run the prediction with all needed parameters
    const prediction = await replicate.predictions.create({
      version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      input: {
        prompt: "A TOK Emoji of " + prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1
      }
    });
    
    console.log("Prediction started:", prediction.id);
    
    // Wait for the prediction to complete
    let finalPrediction = await replicate.wait(prediction);
    
    console.log("COMPLETE PREDICTION:", JSON.stringify(finalPrediction, null, 2));
    
    // Extract the image URL from the output
    let imageUrl = null;
    
    if (finalPrediction.output && Array.isArray(finalPrediction.output) && finalPrediction.output.length > 0) {
      imageUrl = finalPrediction.output[0];
    }
    
    console.log("Extracted image URL:", imageUrl);
    
    if (!imageUrl) {
      return NextResponse.json({ 
        error: "Failed to generate image URL", 
        output: finalPrediction.output 
      }, { status: 500 });
    }
    
    // Return in the exact format the frontend expects
    return NextResponse.json({ 
      imageUrl: imageUrl,
      prompt: prompt,
      success: !!imageUrl
    });
  } catch (error: any) {
    console.error('Error in emoji generation API:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error',
      success: false 
    }, { status: 500 });
  }
} 