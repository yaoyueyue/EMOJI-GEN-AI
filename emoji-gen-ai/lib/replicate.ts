import Replicate from 'replicate';

// Create Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Emoji generation function
export async function generateEmoji(prompt: string) {
  try {
    // Enhanced prompt formatting
    const enhancedPrompt = `A TOK Emoji of ${prompt}. `;
    
    const output = await replicate.run(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      {
        input: {
          width: 1024,
          height: 1024,
          prompt: enhancedPrompt,
          refine: "no_refiner",
          scheduler: "K_EULER",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: false,
          high_noise_frac: 0.8,
          negative_prompt: "ugly, deformed, noisy, blurry, distorted, text, watermark, username, badly drawn face",
          prompt_strength: 0.8,
          num_inference_steps: 50
        }
      }
    );
    
    // Process the output to match what the frontend expects
    let imageUrl = null;
    
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    }
    
    // Return object matching frontend expectations
    return {
      imageUrl: imageUrl,
      prompt: prompt,
      success: !!imageUrl
    };
  } catch (error) {
    console.error('Error generating emoji:', error);
    throw error;
  }
} 