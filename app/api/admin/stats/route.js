import { NextResponse } from 'next/server'
import { getLotteriesCollection, getTicketsCollection, getUsersCollection } from '@/lib/database'
import { getAuthMiddleware } from '@/lib/auth'

export async function GET(request) {
  try {
    const authUser = getAuthMiddleware(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 })
    }
    
    const lotteriesCollection = await getLotteriesCollection()
    const ticketsCollection = await getTicketsCollection()
    const usersCollection = await getUsersCollection()
    
    // Get total lotteries
    const totalLotteries = await lotteriesCollection.countDocuments({})
    const activeLotteries = await lotteriesCollection.countDocuments({ status: 'active' })
    
    // Get total tickets sold
    const totalTickets = await ticketsCollection.countDocuments({})
    
    // Calculate total revenue
    const lotteries = await lotteriesCollection.find({}).toArray()
    let totalRevenue = 0
    
    for (const lottery of lotteries) {
      totalRevenue += lottery.soldTickets * lottery.ticketPrice
    }
    
    // Get total users (excluding admin)
    const totalUsers = await usersCollection.countDocuments({ role: { $ne: 'admin' } })
    
    return NextResponse.json({
      totalLotteries,
      activeLotteries,
      totalTickets,
      totalRevenue,
      totalUsers
    })
  } catch (error) {
    console.error('Get stats error:', error)
    return NextResponse.json({ error: 'خطا در دریافت آمار' }, { status: 500 })
  }
}