import { NextResponse } from 'next/server'
import { getLotteriesCollection } from '@/lib/database'
import { getAuthMiddleware } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    const { id } = params
    const lotteriesCollection = await getLotteriesCollection()
    const lottery = await lotteriesCollection.findOne({ _id: id })
    
    if (!lottery) {
      return NextResponse.json({ error: 'قرعه‌کشی یافت نشد' }, { status: 404 })
    }
    
    return NextResponse.json({ lottery })
  } catch (error) {
    console.error('Get lottery error:', error)
    return NextResponse.json({ error: 'خطا در دریافت قرعه‌کشی' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const authUser = getAuthMiddleware(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 })
    }
    
    const { id } = params
    const {
      title,
      description,
      prize,
      prizeImage,
      ticketPrice,
      totalTickets,
      drawDate,
      drawTime,
      status
    } = await request.json()
    
    const lotteriesCollection = await getLotteriesCollection()
    
    const updateData = {
      title,
      description,
      prize,
      prizeImage,
      ticketPrice: parseInt(ticketPrice),
      totalTickets: parseInt(totalTickets),
      drawDate,
      drawTime,
      status,
      updatedAt: new Date()
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })
    
    const result = await lotteriesCollection.updateOne(
      { _id: id },
      { $set: updateData }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'قرعه‌کشی یافت نشد' }, { status: 404 })
    }
    
    const updatedLottery = await lotteriesCollection.findOne({ _id: id })
    
    return NextResponse.json({ success: true, lottery: updatedLottery })
  } catch (error) {
    console.error('Update lottery error:', error)
    return NextResponse.json({ error: 'خطا در به‌روزرسانی قرعه‌کشی' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = getAuthMiddleware(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 })
    }
    
    const { id } = params
    const lotteriesCollection = await getLotteriesCollection()
    
    const result = await lotteriesCollection.deleteOne({ _id: id })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'قرعه‌کشی یافت نشد' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete lottery error:', error)
    return NextResponse.json({ error: 'خطا در حذف قرعه‌کشی' }, { status: 500 })
  }
}