"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Trophy, Plus, DollarSign, Users, Ticket, LogOut, Eye, Edit, Trash2 } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    activeLotteries: 0,
    totalTickets: 0
  })
  const [lotteries, setLotteries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userRole = localStorage.getItem("userRole")

    if (!isLoggedIn || userRole !== "admin") {
      router.push("/auth/login")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch lotteries
      const lotteriesResponse = await fetch('/api/lotteries')
      if (lotteriesResponse.ok) {
        const lotteriesData = await lotteriesResponse.json()
        setLotteries(lotteriesData.lotteries || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    router.push("/")
  }

  const handleDeleteLottery = async (lotteryId) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این قرعه‌کشی را حذف کنید؟')) {
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch(`/api/lotteries/${lotteryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('قرعه‌کشی با موفقیت حذف شد')
        fetchData() // Refresh data
      } else {
        const data = await response.json()
        alert(data.error || 'خطا در حذف قرعه‌کشی')
      }
    } catch (error) {
      alert('خطا در ارتباط با سرور')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " ریال"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600">پنل مدیریت - قرعه‌کشی اتوتقی زاده</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            خروج
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل درآمد</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">+۲۰.۱% نسبت به ماه گذشته</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کاربران</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers.toLocaleString("fa-IR")}</div>
              <p className="text-xs text-muted-foreground">+۱۸۰ کاربر جدید این ماه</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قرعه‌کشی‌های فعال</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeLotteries}</div>
              <p className="text-xs text-muted-foreground">۲ قرعه‌کشی در انتظار</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">بلیط‌های فروخته شده</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soldTickets.toLocaleString("fa-IR")}</div>
              <p className="text-xs text-muted-foreground">+۲۰۱ بلیط امروز</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="lotteries" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lotteries">مدیریت قرعه‌کشی‌ها</TabsTrigger>
            <TabsTrigger value="payments">تنظیمات پرداخت</TabsTrigger>
            <TabsTrigger value="settings">تنظیمات کلی</TabsTrigger>
          </TabsList>

          <TabsContent value="lotteries" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">مدیریت قرعه‌کشی‌ها</h2>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                قرعه‌کشی جدید
              </Button>
            </div>

            <div className="grid gap-4">
              {lotteries.map((lottery) => (
                <Card key={lottery.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {lottery.title}
                          <Badge variant={lottery.status === "فعال" ? "default" : "secondary"}>{lottery.status}</Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">{lottery.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">قیمت بلیط:</span>
                        <div className="font-medium">{formatCurrency(lottery.ticketPrice)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">تاریخ قرعه‌کشی:</span>
                        <div className="font-medium">{lottery.drawDate}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">بلیط‌های فروخته شده:</span>
                        <div className="font-medium">{lottery.soldTickets.toLocaleString("fa-IR")}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">درآمد:</span>
                        <div className="font-medium">{formatCurrency(lottery.ticketPrice * lottery.soldTickets)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات درگاه پرداخت</CardTitle>
                <CardDescription>API کلیدهای درگاه پرداخت را تنظیم کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">نام درگاه پرداخت</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>زرین‌پال</option>
                      <option>پی‌دات‌آی‌آر</option>
                      <option>آی‌دی‌پی</option>
                      <option>پارسیان</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Merchant ID</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="شناسه پذیرنده را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <input
                      type="password"
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="کلید API را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Callback URL</label>
                    <input
                      type="url"
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="https://yoursite.com/payment/callback"
                    />
                  </div>
                </div>
                <Button>ذخیره تنظیمات</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>تنظیمات کلی سیستم</CardTitle>
                <CardDescription>تنظیمات عمومی سیستم قرعه‌کشی</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">نام سایت</label>
                    <input
                      type="text"
                      className="w-full mt-1 p-2 border rounded-md"
                      defaultValue="قرعه‌کشی اتوتقی زاده"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">ایمیل پشتیبانی</label>
                    <input
                      type="email"
                      className="w-full mt-1 p-2 border rounded-md"
                      defaultValue="support@lottery.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">شماره تماس</label>
                    <input type="tel" className="w-full mt-1 p-2 border rounded-md" defaultValue="021-12345678" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">درصد کمیسیون سیستم</label>
                    <input
                      type="number"
                      className="w-full mt-1 p-2 border rounded-md"
                      defaultValue="10"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <Button>ذخیره تنظیمات</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تنظیمات پیامک</CardTitle>
                <CardDescription>API کلیدهای سرویس پیامک را تنظیم کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">سرویس پیامک</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>کاوه نگار</option>
                      <option>ملی پیامک</option>
                      <option>فراپیامک</option>
                      <option>پیامک ده</option>
                      <option>اس ام اس ایر</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Key</label>
                    <input
                      type="password"
                      className="w-full mt-1 p-2 border rounded-md"
                      placeholder="کلید API سرویس پیامک را وارد کنید"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">شماره فرستنده</label>
                    <input type="text" className="w-full mt-1 p-2 border rounded-md" placeholder="مثال: 10008566" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">متن پیامک خرید بلیط</label>
                    <textarea
                      className="w-full mt-1 p-2 border rounded-md"
                      rows={3}
                      defaultValue="سلام {name}
بلیط شما با موفقیت خریداری شد.
شماره بلیط: {ticket_number}
قرعه‌کشی: {lottery_title}
تاریخ قرعه‌کشی: {draw_date}
قرعه‌کشی اتوتقی زاده"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">متن پیامک اعلام نتیجه</label>
                    <textarea
                      className="w-full mt-1 p-2 border rounded-md"
                      rows={3}
                      defaultValue="تبریک {name}!
شما در قرعه‌کشی {lottery_title} برنده شدید.
شماره بلیط برنده: {ticket_number}
جهت دریافت جایزه با ما تماس بگیرید.
قرعه‌کشی اتوتقی زاده"
                    />
                  </div>
                </div>
                <Button>ذخیره تنظیمات پیامک</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
