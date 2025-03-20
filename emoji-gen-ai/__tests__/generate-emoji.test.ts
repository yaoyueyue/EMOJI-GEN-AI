import { NextRequest } from 'next/server';
import { POST } from '@/app/api/generate-emoji/route';
import Replicate from 'replicate';

// Mock the Replicate library
jest.mock('replicate', () => {
  return jest.fn().mockImplementation(() => {
    return {
      run: jest.fn()
    };
  });
});

// Mock console.log and console.error to keep test output clean
global.console.log = jest.fn();
global.console.error = jest.fn();

// Store original env
const originalEnv = process.env;

describe('Emoji Generation API', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Reset environment variables
    process.env = { ...originalEnv };
    process.env.REPLICATE_API_TOKEN = 'test-token';
  });

  afterAll(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it('should return 400 if prompt is missing', async () => {
    // Create a mock request with no prompt
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    // Call the API handler
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(400);
    expect(data.error).toBe('Prompt is required');
  });

  it('should return 500 if API token is missing', async () => {
    // Remove the API token
    delete process.env.REPLICATE_API_TOKEN;

    // Create a mock request with a prompt
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'happy cat' }),
    });

    // Call the API handler
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(500);
    expect(data.error).toBe('Missing API token - please configure REPLICATE_API_TOKEN');
  });

  it('should handle successful emoji generation with array response', async () => {
    // Mock the Replicate run function to return an array with a URL
    const mockUrl = 'https://replicate.delivery/example.png';
    const mockRun = jest.fn().mockResolvedValue([mockUrl]);
    
    // Override the mock implementation for this test
    (Replicate as jest.Mock).mockImplementation(() => ({
      run: mockRun
    }));

    // Create a mock request with a prompt
    const prompt = 'happy dog';
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    // Call the API handler
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(data.imageUrl).toBe(mockUrl);
    expect(data.prompt).toBe(prompt);
    expect(data.success).toBe(true);

    // Verify Replicate was called correctly
    expect(mockRun).toHaveBeenCalledWith(
      "fofr/sdxl-emoji:dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      expect.objectContaining({
        input: expect.objectContaining({
          prompt: prompt
        })
      })
    );
  });

  it('should handle successful emoji generation with string response', async () => {
    // Mock the Replicate run function to return a string URL directly
    const mockUrl = 'https://replicate.delivery/example.png';
    const mockRun = jest.fn().mockResolvedValue(mockUrl);
    
    // Override the mock implementation for this test
    (Replicate as jest.Mock).mockImplementation(() => ({
      run: mockRun
    }));

    // Create a mock request with a prompt
    const prompt = 'happy cat';
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    // Call the API handler
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(data.imageUrl).toBe(mockUrl);
  });

  it('should handle successful emoji generation with object response', async () => {
    // Mock the Replicate run function to return an object with a URL
    const mockUrl = 'https://replicate.delivery/example.png';
    const mockRun = jest.fn().mockResolvedValue({ output: mockUrl });
    
    // Override the mock implementation for this test
    (Replicate as jest.Mock).mockImplementation(() => ({
      run: mockRun
    }));

    // Create a mock request with a prompt
    const prompt = 'sad dog';
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });

    // Call the API handler
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(200);
    expect(data.imageUrl).toBe(mockUrl);
  });

  it('should handle Replicate API errors', async () => {
    // Mock the Replicate run function to throw an error
    const mockError = new Error('API rate limit exceeded');
    const mockRun = jest.fn().mockRejectedValue(mockError);
    
    // Override the mock implementation for this test
    (Replicate as jest.Mock).mockImplementation(() => ({
      run: mockRun
    }));

    // Create a mock request with a prompt
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'error test' }),
    });

    // Call the API handler
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(500);
    expect(data.error).toBe('API rate limit exceeded');
  });

  it('should handle invalid output format from Replicate', async () => {
    // Mock the Replicate run function to return an invalid format
    const mockRun = jest.fn().mockResolvedValue({});
    
    // Override the mock implementation for this test
    (Replicate as jest.Mock).mockImplementation(() => ({
      run: mockRun
    }));

    // Create a mock request with a prompt
    const request = new NextRequest('http://localhost:3000/api/generate-emoji', {
      method: 'POST',
      body: JSON.stringify({ prompt: 'invalid test' }),
    });

    // Call the API handler
    const response = await POST(request);
    const data = await response.json();

    // Verify response
    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to extract image URL from generation result');
  });
}); 