import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Test API received:", body)

    // Return a success response with a properly accessible image URL
    return NextResponse.json({
      success: true,
      message: "Test API successful",
      imageUrl: "/images/emoji.jpeg"  // Path relative to public directory
    })
  } catch (error) {
    console.error("Error in test API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    )
  }
} 