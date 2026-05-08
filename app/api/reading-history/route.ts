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

    const { bookId, status, currentPage, totalPages } = await request.json()

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

    const progress = totalPages ? (currentPage / totalPages) * 100 : 0

    const history = await prisma.readingHistory.upsert({
      where: {
        userId_bookId: {
          userId: user.userId,
          bookId,
        },
      },
      create: {
        userId: user.userId,
        bookId,
        status: status || 'reading',
        currentPage: currentPage || 0,
        totalPages,
        progress,
      },
      update: {
        status: status || undefined,
        currentPage: currentPage !== undefined ? currentPage : undefined,
        totalPages: totalPages || undefined,
        progress: totalPages ? (currentPage / totalPages) * 100 : undefined,
      },
    })

    return NextResponse.json(history)
  } catch (error) {
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

    const history = await prisma.readingHistory.findMany({
      where: { userId: user.userId },
      include: { book: true },
      skip,
      take: limit,
      orderBy: { lastReadDate: 'desc' },
    })

    const total = await prisma.readingHistory.count({
      where: { userId: user.userId },
    })

    return NextResponse.json({
      data: history,
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
