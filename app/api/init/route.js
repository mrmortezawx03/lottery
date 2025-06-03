import { NextResponse } from 'next/server'
import { initializeDatabase } from '@/lib/database'

export async function GET() {
  try {
    await initializeDatabase()
    return NextResponse.json({ success: true, message: 'Database initialized successfully' })
  } catch (error) {
    console.error('Database initialization error:', error)
    return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 })
  }
}