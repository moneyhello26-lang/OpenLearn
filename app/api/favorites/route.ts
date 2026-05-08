import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bookId } = await request.json()

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      )
    }

    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.userId,
        bookId,
      },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Book already in favorites' },
        { status: 400 }
      )
    }
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))
    const skip = (page - 1) * limit

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.userId },
      include: { book: true },
      skip,
      take: limit,
      orderBy: { addedAt: 'desc' },
    })

    const total = await prisma.favorite.count({
      where: { userId: user.userId },
    })

    return NextResponse.json({
      data: favorites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
