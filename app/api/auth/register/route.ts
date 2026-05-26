import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    const token = generateToken(user.id, user.email)

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
