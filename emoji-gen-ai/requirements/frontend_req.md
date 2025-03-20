# Frontend Instructions for EmojiGen

## Overview
Use this guide to build a web app where users can give a text prompt to generate an emoji using a model hosted on Replicate.

## Feature requirements
- We will use Next.js, Shadcn, Lucid, Supabase, Clerk
- Users put text in a text prompt and click a button, or click 'Try:' in rightcorner, an emoji will be generated
- An emoji pop up in the center of the screen,when hover over the emoji, an icon button for download, like should appear horizontally,and right uppercorner will show small/close button
- When click download, the emoji will be downloaded
- When click like, the emoji will be liked and moved to the top of the grid
- When click close/small button, the emoji will be closed and displayed in the grid

## Relevant Docs
### How to use replicate emoji generator model
Install Replicate’s Node.js client library
npm install replicate

Copy
Set the REPLICATE_API_TOKEN environment variable
export REPLICATE_API_TOKEN=<paste-your-token-here>

Visibility

Copy
Find your API token in your account settings.

Import and set up the client
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

Copy
Run fofr/sdxl-emoji using Replicate’s API. Check out the model's schema for an overview of inputs and outputs.

const output = await replicate.run(
  "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
  {
    input: {
      width: 1024,
      height: 1024,
      prompt: "A TOK emoji of a man",
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
  }
);
console.log(output);

## File Structure


## Rules
- All new components should go in /components and be named like example-component.tsx unless otherwise specified
- All new pages go in /app
