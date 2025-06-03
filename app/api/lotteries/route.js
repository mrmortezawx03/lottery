import { NextResponse } from 'next/server'
import { getLotteriesCollection } from '@/lib/database'
import { getAuthMiddleware } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const lotteriesCollection = await getLotteriesCollection()
    const lotteries = await lotteriesCollection.find({}).toArray()
    
    return NextResponse.json({ lotteries })
  } catch (error) {
    console.error('Get lotteries error:', error)
    return NextResponse.json({ error: 'خطا در دریافت قرعه‌کشی‌ها' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authUser = getAuthMiddleware(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 })
    }
    
    const {
      title,
      description,
      prize,
      prizeImage,
      ticketPrice,
      totalTickets,
      drawDate,
      drawTime
    } = await request.json()
    
    if (!title || !description || !prize || !ticketPrice || !totalTickets || !drawDate) {
      return NextResponse.json({ error: 'تمام فیلدهای الزامی را پر کنید' }, { status: 400 })
    }
    
    const lotteriesCollection = await getLotteriesCollection()
    
    const lottery = {
      _id: uuidv4(),
      title,
      description,
      prize,
      prizeImage: prizeImage || null,
      ticketPrice: parseInt(ticketPrice),
      totalTickets: parseInt(totalTickets),
      soldTickets: 0,
      drawDate,
      drawTime: drawTime || '20:00',
      status: 'active',
      createdAt: new Date(),
      createdBy: authUser.userId
    }
    
    await lotteriesCollection.insertOne(lottery)
    
    return NextResponse.json({ success: true, lottery })
  } catch (error) {
    console.error('Create lottery error:', error)
    return NextResponse.json({ error: 'خطا در ایجاد قرعه‌کشی' }, { status: 500 })
  }
}