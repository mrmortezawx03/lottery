import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, DollarSign, Ticket, ArrowRight } from "lucide-react"

export default function LotteriesPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " ریال"
  }

  const lotteries = [
    {
      id: 1,
      title: "قرعه‌کشی خودرو",
      description: "برنده یک خودرو پژو پارس مدل ۱۴۰۳ شوید. این خودرو کاملاً صفر و با گارانتی کامل ارائه می‌شود.",
      ticketPrice: 50000,
      drawDate: "۱۵ آذر ۱۴۰۳",
      remainingTickets: 155,
      totalTickets: 400,
      prize: "خودرو پژو پارس",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "قرعه‌کشی طلا",
      description: "برنده ۱۰ سکه طلای تمام بهار آزادی شوید. طلاهای ارائه شده از بهترین کیفیت و با گواهی معتبر هستند.",
      ticketPrice: 20000,
      drawDate: "۲۰ آذر ۱۴۰۳",
      remainingTickets: 113,
      totalTickets: 500,
      prize: "۱۰ سکه طلا",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "قرعه‌کشی نقدی",
      description: "برنده ۱۰ میلیون ریال نقد شوید. مبلغ بلافاصله پس از قرعه‌کشی به حساب شما واریز خواهد شد.",
      ticketPrice: 10000,
      drawDate: "۲۵ آذر ۱۴۰۳",
      remainingTickets: 240,
      totalTickets: 1000,
      prize: "۱۰ میلیون ریال نقد",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "قرعه‌کشی موبایل",
      description: "برنده گوشی موبایل آیفون ۱۵ پرو مکس شوید. گوشی کاملاً اورجینال و با گارانتی معتبر.",
      ticketPrice: 30000,
      drawDate: "۳۰ آذر ۱۴۰۳",
      remainingTickets: 89,
      totalTickets: 300,
      prize: "آیفون ۱۵ پرو مکس",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "قرعه‌کشی لپ‌تاپ",
      description: "برنده لپ‌تاپ ایسوس ROG مخصوص گیمینگ شوید. با مشخصات فوق‌العاده برای کار و بازی.",
      ticketPrice: 25000,
      drawDate: "۵ دی ۱۴۰۳",
      remainingTickets: 67,
      totalTickets: 200,
      prize: "لپ‌تاپ ایسوس ROG",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "قرعه‌کشی سفر",
      description: "برنده یک سفر ۷ روزه به ترکیه برای ۲ نفر شوید. شامل بلیط هواپیما، هتل و صبحانه.",
      ticketPrice: 15000,
      drawDate: "۱۰ دی ۱۴۰۳",
      remainingTickets: 178,
      totalTickets: 600,
      prize: "سفر ۷ روزه ترکیه",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50" dir="rtl">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-purple-600">قرعه‌کشی‌ها</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button variant="outline">ورود</Button>
            </Link>
            <Link href="/auth/register">
              <Button>ثبت نام</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">قرعه‌کشی‌های فعال</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            از میان قرعه‌کشی‌های متنوع ما انتخاب کنید و شانس برنده شدن جوایز ارزشمند را داشته باشید
          </p>
        </div>

        {/* Lotteries Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lotteries.map((lottery) => (
            <Card key={lottery.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                <Trophy className="h-16 w-16 text-purple-600" />
              </div>

              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{lottery.title}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {lottery.remainingTickets} باقی‌مانده
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
                    <span className="font-medium">{lottery.drawDate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Ticket className="h-4 w-4" />
                      بلیط‌های فروخته شده:
                    </span>
                    <span className="font-medium">
                      {(lottery.totalTickets - lottery.remainingTickets).toLocaleString("fa-IR")} /{" "}
                      {lottery.totalTickets.toLocaleString("fa-IR")}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>پیشرفت فروش</span>
                    <span>
                      {Math.round(((lottery.totalTickets - lottery.remainingTickets) / lottery.totalTickets) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((lottery.totalTickets - lottery.remainingTickets) / lottery.totalTickets) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <Link href="/auth/register">
                  <Button className="w-full flex items-center justify-center gap-2">
                    شرکت در قرعه‌کشی
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">آماده شرکت در قرعه‌کشی هستید؟</h3>
          <p className="text-gray-600 mb-6">برای شرکت در قرعه‌کشی‌ها ابتدا ثبت نام کنید یا وارد حساب کاربری خود شوید</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg">ثبت نام رایگان</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                ورود به حساب
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
