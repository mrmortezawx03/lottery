import { NextResponse } from 'next/server'
import { getTicketsCollection, getLotteriesCollection } from '@/lib/database'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const lotteryId = url.searchParams.get('lotteryId')
    
    const ticketsCollection = await getTicketsCollection()
    
    let query = {}
    if (lotteryId) {
      query.lotteryId = lotteryId
    }
    
    const tickets = await ticketsCollection.find(query).toArray()
    
    return NextResponse.json({ tickets })
  } catch (error) {
    console.error('Get tickets error:', error)
    return NextResponse.json({ error: 'خطا در دریافت بلیط‌ها' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const {
      lotteryId,
      buyerName,
      buyerPhone
    } = await request.json()
    
    if (!lotteryId || !buyerName || !buyerPhone) {
      return NextResponse.json({ error: 'تمام فیلدهای الزامی را پر کنید' }, { status: 400 })
    }
    
    const lotteriesCollection = await getLotteriesCollection()
    const ticketsCollection = await getTicketsCollection()
    
    // Check if lottery exists and is active
    const lottery = await lotteriesCollection.findOne({ _id: lotteryId })
    
    if (!lottery) {
      return NextResponse.json({ error: 'قرعه‌کشی یافت نشد' }, { status: 404 })
    }
    
    if (lottery.status !== 'active') {
      return NextResponse.json({ error: 'قرعه‌کشی غیرفعال است' }, { status: 400 })
    }
    
    if (lottery.soldTickets >= lottery.totalTickets) {
      return NextResponse.json({ error: 'تمام بلیط‌ها فروخته شده است' }, { status: 400 })
    }
    
    // Generate sequential ticket code
    const ticketCount = await ticketsCollection.countDocuments({ lotteryId })
    const ticketCode = ticketCount + 1
    
    const ticket = {
      _id: uuidv4(),
      lotteryId,
      ticketCode,
      buyerName,
      buyerPhone,
      purchaseDate: new Date(),
      status: 'active'
    }
    
    // Insert ticket and update lottery sold tickets count
    await ticketsCollection.insertOne(ticket)
    await lotteriesCollection.updateOne(
      { _id: lotteryId },
      { $inc: { soldTickets: 1 } }
    )
    
    return NextResponse.json({ 
      success: true, 
      ticket,
      lotteryTitle: lottery.title,
      ticketPrice: lottery.ticketPrice
    })
  } catch (error) {
    console.error('Create ticket error:', error)
    return NextResponse.json({ error: 'خطا در خرید بلیط' }, { status: 500 })
  }
}