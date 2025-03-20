import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    console.log("Test Mock API received:", body)

    // Return a mock emoji with a placeholder image
    return NextResponse.json({
      success: true,
      message: "Mock emoji generated",
      imageUrl: "https://placehold.co/200x200/FFD700/FFF?text=😀"
    })
  } catch (error) {
    console.error("Error in test-mock API:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    )
  }
} 