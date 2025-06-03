import { NextResponse } from 'next/server'
import { getAuthMiddleware } from '@/lib/auth'

export async function POST(request) {
  try {
    const authUser = getAuthMiddleware(request)
    
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 401 })
    }
    
    const { image, filename } = await request.json()
    
    if (!image) {
      return NextResponse.json({ error: 'تصویر الزامی است' }, { status: 400 })
    }
    
    // Validate base64 image
    if (!image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'فرمت تصویر نامعتبر است' }, { status: 400 })
    }
    
    // Check image size (limit to 5MB)
    const imageSizeInBytes = Math.round((image.length * 3) / 4)
    const maxSizeInBytes = 5 * 1024 * 1024 // 5MB
    
    if (imageSizeInBytes > maxSizeInBytes) {
      return NextResponse.json({ error: 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد' }, { status: 400 })
    }
    
    return NextResponse.json({ 
      success: true,
      imageUrl: image,
      filename: filename || 'uploaded-image'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'خطا در آپلود تصویر' }, { status: 500 })
  }
}