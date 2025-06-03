import clientPromise from './mongodb'
import { v4 as uuidv4 } from 'uuid'

export async function getDatabase() {
  const client = await clientPromise
  return client.db('lottery_system')
}

// Collections
export async function getUsersCollection() {
  const db = await getDatabase()
  return db.collection('users')
}

export async function getLotteriesCollection() {
  const db = await getDatabase()
  return db.collection('lotteries')
}

export async function getTicketsCollection() {
  const db = await getDatabase()
  return db.collection('tickets')
}

export async function getSettingsCollection() {
  const db = await getDatabase()
  return db.collection('settings')
}

// Database initialization
export async function initializeDatabase() {
  try {
    const db = await getDatabase()
    
    // Create indexes
    await db.collection('users').createIndex({ phone: 1 }, { unique: true })
    await db.collection('lotteries').createIndex({ _id: 1 })
    await db.collection('tickets').createIndex({ lotteryId: 1 })
    await db.collection('tickets').createIndex({ ticketCode: 1 }, { unique: true })
    
    // Check if admin user exists
    const usersCollection = await getUsersCollection()
    const adminExists = await usersCollection.findOne({ role: 'admin' })
    
    if (!adminExists) {
      // Create default admin user
      const { hashPassword } = await import('./auth')
      await usersCollection.insertOne({
        _id: uuidv4(),
        phone: '09144191962',
        password: hashPassword('admin123'),
        role: 'admin',
        createdAt: new Date()
      })
      console.log('Default admin user created')
    }
    
    // Initialize settings if not exists
    const settingsCollection = await getSettingsCollection()
    const settingsExists = await settingsCollection.findOne({})
    
    if (!settingsExists) {
      await settingsCollection.insertOne({
        _id: uuidv4(),
        siteName: 'قرعه‌کشی اتوتقی زاده',
        supportEmail: 'support@lottery.com',
        supportPhone: '021-12345678',
        commissionRate: 10,
        createdAt: new Date()
      })
      console.log('Default settings created')
    }
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}