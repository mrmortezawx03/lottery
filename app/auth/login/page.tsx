"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: "09144191962",
    password: "admin123",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log('Submitting login form with data:', formData)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok && data.success) {
        // Store auth data
        localStorage.setItem("userRole", data.user.role)
        localStorage.setItem("isLoggedIn", "true")
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("userId", data.user.id)
        
        console.log('Login successful, redirecting...')
        if (data.user.role === 'admin') {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        console.error('Login failed:', data.error)
        setError(data.error || "خطا در ورود")
      }
    } catch (err) {
      console.error('Login error:', err)
      setError("خطا در ورود. لطفاً دوباره تلاش کنید.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">ورود ادمین - قرعه‌کشی اتوتقی زاده</CardTitle>
          <CardDescription>برای دسترسی به پنل مدیریت وارد شوید</CardDescription>
          <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <strong>اطلاعات ورود پیش‌فرض:</strong><br />
            شماره همراه: 09144191962<br />
            رمز عبور: admin123
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">شماره همراه</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="09123456789"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را وارد کنید"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "در حال ورود..." : "ورود"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Link href="/" className="text-sm text-gray-500 hover:underline block">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
