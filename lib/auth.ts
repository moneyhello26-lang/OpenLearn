import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: '30d' }
  )
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as { userId: string; email: string }
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}

export function verifyRequestToken(request: NextRequest): { userId: string; email: string } | null {
  const token = getTokenFromRequest(request)
  if (!token) return null
  return verifyToken(token)
}
