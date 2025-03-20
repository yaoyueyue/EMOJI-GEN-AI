import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/generate-emoji/route';
import { readFileSync } from 'fs';

// Load environment variables manually
try {
  const envFile = readFileSync('.env.local', 'utf8');
  const envVars = envFile.split('\n').filter(Boolean);
  
  for (const line of envVars) {
    // Skip comments and empty lines
    if (line.startsWith('#') || !line.trim()) continue;
    
    // Parse key=value pairs
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    
    if (key && value) {
      process.env[key.trim()] = value;
    }
  }
  
  console.log("Loaded environment from .env.local manually");
} catch (err) {
  console.error("Failed to load .env.local:", err);
}

// Store original console methods for real output during API tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Emoji Generation API - Real Integration Tests', () => {
  beforeAll(() => {
    // Temporarily restore console for meaningful debugging
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    console.log("Starting real API integration tests - checks if Replicate API works");
    console.log("Using REPLICATE_API_TOKEN from environment:", 
      process.env.REPLICATE_API_TOKEN ? "✅ Token found" : "❌ No token found");
  });

  afterAll(() => {
    console.log("Completed API integration tests");
  });

  // Skip all tests if no token is available
  if (!process.env.REPLICATE_API_TOKEN) {
    test.skip("API tests", () => {
      console.warn("⚠️ Skipping all API tests: No REPLICATE_API_TOKEN found in environment");
    });
    return;
  }

  // Test with a few different prompts
  const testPrompts = [
    "happy yellow dog", 
    "smiling red heart",
    "funny pizza slice"
  ];

  for (const prompt of testPrompts) {
    test(`should generate emoji for prompt: "${prompt}"`, async () => {
      console.log(`\nTesting generation with prompt: "${prompt}"`);
      
      // Create request with the test prompt
      const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });

      console.log("Sending request to API...");
      const startTime = Date.now();
      
      // Call the API handler
      const response = await POST(request);
      
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      console.log(`API responded in ${duration.toFixed(1)} seconds with status: ${response.status}`);
      
      // Verify successful response
      expect(response.status).toBe(200);
      
      const data = await response.json();
      
      // Log response data for debugging
      console.log("API response data:", {
        success: data.success,
        hasImageUrl: !!data.imageUrl,
        imageUrlType: typeof data.imageUrl,
        imageUrlDetails: typeof data.imageUrl === 'string' 
          ? data.imageUrl.substring(0, 50) + "..." 
          : JSON.stringify(data.imageUrl).substring(0, 50) + "..."
      });
      
      // Verify the response contains what we expect
      expect(data).toHaveProperty('imageUrl');
      if (typeof data.imageUrl === 'string') {
        expect(data.imageUrl).toContain('https://');
      } else {
        console.log("imageUrl is not a string but an object:", data.imageUrl);
        // You might want to extract a URL from the object if possible
      }
      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('prompt', prompt);
      
      // Verify the image URL points to a real image by making a HEAD request
      console.log("Verifying image URL is accessible...");
      try {
        const imageResponse = await fetch(data.imageUrl, { method: 'HEAD' });
        console.log(`Image URL status: ${imageResponse.status}`);
        expect(imageResponse.status).toBe(200);
        expect(imageResponse.headers.get('content-type')).toContain('image/');
      } catch (error) {
        console.error("Failed to verify image URL:", error);
        throw new Error("Image URL verification failed");
      }
      
      console.log(`✅ Successfully generated and verified emoji for "${prompt}"`);
    }, 45000); // Allow up to 45 seconds for API processing
  }

  test('should handle invalid prompts gracefully', async () => {
    const badPrompt = "".padStart(1000, "a"); // Very long prompt
    
    console.log(`\nTesting with invalid prompt (${badPrompt.length} chars)`);
    
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({ prompt: badPrompt }),
    });
    
    const response = await POST(request);
    console.log(`API responded with status: ${response.status}`);
    
    // The API should either return an error or still generate something
    if (response.status === 200) {
      const data = await response.json();
      expect(data).toHaveProperty('imageUrl');
      console.log("API handled the bad prompt successfully");
    } else {
      const data = await response.json();
      console.log("API rejected the bad prompt with error:", data.error);
      expect(data).toHaveProperty('error');
    }
  }, 30000);
}); 