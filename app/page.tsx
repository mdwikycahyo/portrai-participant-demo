"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("DesignUniverse@outlook.co")
  const [password, setPassword] = useState("")

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/home")
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Gradient background */}
      <div className="hidden m-4 lg:flex lg:w-1/2 bg-gradient-to-br from-purple-400 via-purple-500 to-teal-400 rounded-3xl"></div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center p-1">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">Logoipsum</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">Forgot Password?</span>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Button>
          </form>

          {/* Footer */}
          <div className="space-y-4 text-center">
            <div className="flex justify-center gap-6 text-sm text-gray-600">
              <span className="cursor-pointer hover:text-gray-800">Privacy</span>
              <span className="cursor-pointer hover:text-gray-800">Terms</span>
              <span className="cursor-pointer hover:text-gray-800">FAQ</span>
            </div>
            <p className="text-xs text-gray-500">© Daya Dimensi Indonesia. 2025. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
