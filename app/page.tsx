"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Ticket, Trophy, Users, DollarSign, Calendar, CreditCard, ArrowRight } from "lucide-react"

export default function HomePage() {
  const [lotteries, setLotteries] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchaseData, setPurchaseData] = useState({
    name: "",
    phone: "",
    lotteryId: "",
    lotteryTitle: "",
    price: 0,
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState(null)

  useEffect(() => {
    fetchLotteries()
  }, [])

  const fetchLotteries = async () => {
    try {
      const response = await fetch('/api/lotteries')
      const data = await response.json()
      
      if (response.ok) {
        setLotteries(data.lotteries || [])
      }
    } catch (error) {
      console.error('Error fetching lotteries:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " ریال"
  }

  const handlePurchase = async () => {
    if (!purchaseData.name || !purchaseData.phone || !purchaseData.lotteryId) {
      return
    }

    setIsProcessing(true)
    setPurchaseResult(null)

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lotteryId: purchaseData.lotteryId,
          buyerName: purchaseData.name,
          buyerPhone: purchaseData.phone,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setPurchaseResult({
          success: true,
          ticketCode: data.ticket.ticketCode,
          lotteryTitle: data.lotteryTitle,
          ticketPrice: data.ticketPrice,
        })

        // Refresh lotteries to update sold tickets
        fetchLotteries()

        // Reset form
        setPurchaseData({
          name: "",
          phone: "",
          lotteryId: "",
          lotteryTitle: "",
          price: 0,
        })
      } else {
        setPurchaseResult({
          success: false,
          error: data.error || "خطا در خرید بلیط"
        })
      }
    } catch (error) {
      setPurchaseResult({
        success: false,
        error: "خطا در ارتباط با سرور"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Trophy className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600">قرعه‌کشی اتوتقی زاده</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline">ورود ادمین</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">به قرعه‌کشی اتوتقی زاده خوش آمدید</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            در قرعه‌کشی‌های هیجان‌انگیز شرکت کنید و شانس برنده شدن جوایز ارزشمند را داشته باشید
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Ticket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>خرید آسان بلیط</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>با چند کلیک ساده بلیط قرعه‌کشی خود را خریداری کنید</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>پرداخت امن</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>پرداخت‌های شما با بالاترین سطح امنیت انجام می‌شود</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>مدیریت حرفه‌ای</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>قرعه‌کشی‌ها با شفافیت کامل و مدیریت حرفه‌ای برگزار می‌شود</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lotteries Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">قرعه‌کشی‌های فعال</h3>
          
          {lotteries.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">در حال حاضر هیچ قرعه‌کشی فعالی وجود ندارد</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteries.filter(lottery => lottery.status === 'active').map((lottery) => (
                <Card key={lottery._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    {lottery.prizeImage ? (
                      <img 
                        src={lottery.prizeImage} 
                        alt={lottery.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Trophy className="h-16 w-16 text-purple-600" />
                    )}
                  </div>

                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{lottery.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {lottery.totalTickets - lottery.soldTickets} باقی‌مانده
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{lottery.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Prize */}
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">{lottery.prize}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          قیمت بلیط:
                        </span>
                        <span className="font-bold text-green-600">{formatCurrency(lottery.ticketPrice)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          تاریخ قرعه‌کشی:
                        </span>
                        <span className="font-medium">{new Date(lottery.drawDate).toLocaleDateString('fa-IR')}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 flex items-center gap-1">
                          <Ticket className="h-4 w-4" />
                          بلیط‌های فروخته شده:
                        </span>
                        <span className="font-medium">
                          {lottery.soldTickets.toLocaleString("fa-IR")} / {lottery.totalTickets.toLocaleString("fa-IR")}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>پیشرفت فروش</span>
                        <span>
                          {Math.round((lottery.soldTickets / lottery.totalTickets) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${(lottery.soldTickets / lottery.totalTickets) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full flex items-center justify-center gap-2"
                          disabled={lottery.soldTickets >= lottery.totalTickets}
                          onClick={() =>
                            setPurchaseData({
                              ...purchaseData,
                              lotteryId: lottery._id,
                              lotteryTitle: lottery.title,
                              price: lottery.ticketPrice,
                            })
                          }
                        >
                          <CreditCard className="h-4 w-4" />
                          {lottery.soldTickets >= lottery.totalTickets ? 'تمام شد' : 'خرید بلیط'}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>خرید بلیط قرعه‌کشی</DialogTitle>
                          <DialogDescription>برای خرید بلیط {lottery.title} اطلاعات خود را وارد کنید</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {purchaseResult && (
                            <Alert className={purchaseResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                              <AlertDescription className={purchaseResult.success ? "text-green-800" : "text-red-800"}>
                                {purchaseResult.success ? (
                                  <>
                                    <div className="font-bold mb-2">پرداخت با موفقیت انجام شد!</div>
                                    <div>کد بلیط شما: <span className="font-bold">{purchaseResult.ticketCode}</span></div>
                                    <div>قرعه‌کشی: {purchaseResult.lotteryTitle}</div>
                                    <div>مبلغ پرداختی: {formatCurrency(purchaseResult.ticketPrice)}</div>
                                    <div className="mt-2 text-sm">این کد را یادداشت کنید.</div>
                                  </>
                                ) : (
                                  purchaseResult.error
                                )}
                              </AlertDescription>
                            </Alert>
                          )}

                          <div className="p-4 bg-blue-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span>قرعه‌کشی:</span>
                              <span className="font-medium">{lottery.title}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>مبلغ قابل پرداخت:</span>
                              <span className="font-bold text-green-600">{formatCurrency(lottery.ticketPrice)}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="name">نام و نام خانوادگی</Label>
                            <Input
                              id="name"
                              placeholder="نام کامل خود را وارد کنید"
                              value={purchaseData.name}
                              onChange={(e) => setPurchaseData({ ...purchaseData, name: e.target.value })}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">شماره همراه</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="09123456789"
                              value={purchaseData.phone}
                              onChange={(e) => setPurchaseData({ ...purchaseData, phone: e.target.value })}
                              required
                            />
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setPurchaseResult(null)}>انصراف</Button>
                            <Button
                              onClick={handlePurchase}
                              disabled={!purchaseData.name || !purchaseData.phone || isProcessing}
                            >
                              {isProcessing ? "در حال پردازش..." : "پرداخت و خرید"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-bold">قرعه‌کشی اتوتقی زاده</span>
          </div>
          <p className="text-gray-400">تمامی حقوق محفوظ است © ۱۴۰۳</p>
        </div>
      </footer>
    </div>
  )
}
