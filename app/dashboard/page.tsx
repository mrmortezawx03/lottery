"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trophy, Ticket, CreditCard, LogOut, Calendar, DollarSign, User } from "lucide-react"

export default function UserDashboard() {
  const router = useRouter()
  const [userTickets, setUserTickets] = useState([
    {
      id: "T-001234",
      lotteryTitle: "قرعه‌کشی خودرو",
      purchaseDate: "۱۰ آذر ۱۴۰۳",
      drawDate: "۱۵ آذر ۱۴۰۳",
      price: 50000,
      status: "فعال",
    },
    {
      id: "T-001235",
      lotteryTitle: "قرعه‌کشی طلا",
      purchaseDate: "۱۲ آذر ۱۴۰۳",
      drawDate: "۲۰ آذر ۱۴۰۳",
      price: 20000,
      status: "فعال",
    },
  ])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    const userRole = localStorage.getItem("userRole")

    if (!isLoggedIn) {
      router.push("/auth/login")
    } else if (userRole === "admin") {
      router.push("/admin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    router.push("/")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " ریال"
  }

  const handlePurchaseTicket = async (lotteryId: number, price: number) => {
    // Simulate payment process
    const ticketNumber = `T-${Date.now().toString().slice(-6)}`

    // Add new ticket to user's tickets
    const newTicket = {
      id: ticketNumber,
      lotteryTitle: "قرعه‌کشی جدید",
      purchaseDate: new Date().toLocaleDateString("fa-IR"),
      drawDate: "۳۰ آذر ۱۴۰۳",
      price: price,
      status: "فعال",
    }

    setUserTickets([...userTickets, newTicket])
    alert(`بلیط شما با موفقیت خریداری شد!\nشماره بلیط: ${ticketNumber}`)
  }

  const availableLotteries = [
    {
      id: 1,
      title: "قرعه‌کشی خودرو",
      description: "برنده یک خودرو پژو پارس شوید",
      ticketPrice: 50000,
      drawDate: "۱۵ آذر ۱۴۰۳",
      remainingTickets: 155,
    },
    {
      id: 2,
      title: "قرعه‌کشی طلا",
      description: "برنده ۱۰ سکه طلای تمام بهار آزادی",
      ticketPrice: 20000,
      drawDate: "۲۰ آذر ۱۴۰۳",
      remainingTickets: 113,
    },
    {
      id: 3,
      title: "قرعه‌کشی نقدی",
      description: "برنده ۱۰ میلیون ریال نقد شوید",
      ticketPrice: 10000,
      drawDate: "۲۵ آذر ۱۴۰۳",
      remainingTickets: 240,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600">داشبورد کاربری</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>کاربر عزیز</span>
            </div>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">بلیط‌های من</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTickets.length}</div>
              <p className="text-xs text-muted-foreground">بلیط فعال</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل خرید</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(userTickets.reduce((sum, ticket) => sum + ticket.price, 0))}
              </div>
              <p className="text-xs text-muted-foreground">مجموع خریدهای شما</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">قرعه‌کشی‌های آینده</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">قرعه‌کشی در انتظار</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Tickets */}
          <Card>
            <CardHeader>
              <CardTitle>بلیط‌های من</CardTitle>
              <CardDescription>لیست بلیط‌های خریداری شده</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{ticket.lotteryTitle}</div>
                      <div className="text-sm text-gray-500">شماره بلیط: {ticket.id}</div>
                      <div className="text-sm text-gray-500">تاریخ خرید: {ticket.purchaseDate}</div>
                    </div>
                    <div className="text-left">
                      <Badge variant={ticket.status === "فعال" ? "default" : "secondary"}>{ticket.status}</Badge>
                      <div className="text-sm font-medium mt-1">{formatCurrency(ticket.price)}</div>
                    </div>
                  </div>
                ))}
                {userTickets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">هنوز بلیطی خریداری نکرده‌اید</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Lotteries */}
          <Card>
            <CardHeader>
              <CardTitle>قرعه‌کشی‌های فعال</CardTitle>
              <CardDescription>در قرعه‌کشی‌های زیر شرکت کنید</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableLotteries.map((lottery) => (
                  <div key={lottery.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium">{lottery.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{lottery.description}</p>
                      </div>
                      <Badge variant="outline">{lottery.remainingTickets} بلیط باقی‌مانده</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <div>قیمت: {formatCurrency(lottery.ticketPrice)}</div>
                        <div>تاریخ قرعه‌کشی: {lottery.drawDate}</div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <CreditCard className="h-4 w-4 ml-2" />
                            خرید بلیط
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>خرید بلیط قرعه‌کشی</DialogTitle>
                            <DialogDescription>
                              آیا از خرید بلیط {lottery.title} به مبلغ {formatCurrency(lottery.ticketPrice)} اطمینان
                              دارید؟
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline">انصراف</Button>
                            <Button onClick={() => handlePurchaseTicket(lottery.id, lottery.ticketPrice)}>
                              پرداخت و خرید
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
