import { NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/database'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request) {
  try {
    const { phone, password } = await request.json()
    
    if (!phone || !password) {
      return NextResponse.json({ error: 'شماره همراه و رمز عبور الزامی است' }, { status: 400 })
    }
    
    const usersCollection = await getUsersCollection()
    const user = await usersCollection.findOne({ phone })
    
    if (!user) {
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 401 })
    }
    
    const isPasswordValid = verifyPassword(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'رمز عبور اشتباه است' }, { status: 401 })
    }
    
    const token = generateToken({
      userId: user._id,
      phone: user.phone,
      role: user.role
    })
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'خطا در ورود' }, { status: 500 })
  }
}