"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowRight, Trophy } from "lucide-react"

export default function CreateLotteryPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prize: "",
    ticketPrice: "",
    totalTickets: "",
    drawDate: "",
    drawTime: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSuccess(true)
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (error) {
      console.error("Error creating lottery:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: string) => {
    const num = Number.parseInt(amount.replace(/,/g, ""))
    if (isNaN(num)) return ""
    return new Intl.NumberFormat("fa-IR").format(num)
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600">ایجاد قرعه‌کشی جدید - اتوتقی زاده</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                قرعه‌کشی با موفقیت ایجاد شد! در حال انتقال به پنل مدیریت...
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <CardTitle>اطلاعات قرعه‌کشی</CardTitle>
              <CardDescription>فرم زیر را برای ایجاد قرعه‌کشی جدید تکمیل کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان قرعه‌کشی</Label>
                  <Input
                    id="title"
                    placeholder="مثال: قرعه‌کشی خودرو"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات</Label>
                  <Textarea
                    id="description"
                    placeholder="توضیحات کاملی از قرعه‌کشی و جایزه آن ارائه دهید..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prize">جایزه</Label>
                  <Input
                    id="prize"
                    placeholder="مثال: خودرو پژو پارس"
                    value={formData.prize}
                    onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketPrice">قیمت بلیط (ریال)</Label>
                    <Input
                      id="ticketPrice"
                      type="number"
                      placeholder="50000"
                      value={formData.ticketPrice}
                      onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                      required
                    />
                    {formData.ticketPrice && (
                      <p className="text-sm text-gray-500">{formatCurrency(formData.ticketPrice)} ریال</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalTickets">تعداد کل بلیط‌ها</Label>
                    <Input
                      id="totalTickets"
                      type="number"
                      placeholder="1000"
                      value={formData.totalTickets}
                      onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="drawDate">تاریخ قرعه‌کشی</Label>
                    <Input
                      id="drawDate"
                      type="date"
                      value={formData.drawDate}
                      onChange={(e) => setFormData({ ...formData, drawDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drawTime">ساعت قرعه‌کشی</Label>
                    <Input
                      id="drawTime"
                      type="time"
                      value={formData.drawTime}
                      onChange={(e) => setFormData({ ...formData, drawTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {formData.ticketPrice && formData.totalTickets && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">پیش‌بینی درآمد</h3>
                    <p className="text-blue-800">
                      حداکثر درآمد:{" "}
                      {formatCurrency(
                        (Number.parseInt(formData.ticketPrice) * Number.parseInt(formData.totalTickets)).toString(),
                      )}{" "}
                      ریال
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/admin")} className="flex-1">
                    انصراف
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1 flex items-center justify-center gap-2">
                    {isLoading ? "در حال ایجاد..." : "ایجاد قرعه‌کشی"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
