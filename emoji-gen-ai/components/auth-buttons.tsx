"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

export function AuthButtons() {
  const { isSignedIn } = useUser();

  return (
    <>
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <div className="flex gap-2">
          <SignInButton>
            <Button
              variant="ghost"
              className="text-purple-300 hover:text-purple-400 hover:bg-transparent rounded-full px-4 py-1 h-8 text-sm font-medium"
            >
              Login
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button
              variant="ghost"
              className="text-purple-300 hover:text-purple-400 hover:bg-transparent rounded-full px-4 py-1 h-8 text-sm font-medium"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      )}
    </>
  )
} 