import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))
    const skip = (page - 1) * limit

    const ratings = await prisma.rating.findMany({
      where: { bookId },
      include: { user: { select: { name: true, avatar: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.rating.count({
      where: { bookId },
    })

    return NextResponse.json({
      data: ratings,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const user = verifyRequestToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { bookId } = await params
    const { score, review } = await request.json()

    if (!score || score < 1 || score > 5) {
      return NextResponse.json(
        { error: 'Score must be between 1 and 5' },
        { status: 400 }
      )
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    const rating = await prisma.rating.upsert({
      where: {
        userId_bookId: {
          userId: user.userId,
          bookId,
        },
      },
      create: {
        userId: user.userId,
        bookId,
        score,
        review,
      },
      update: {
        score,
        review,
      },
    })

    return NextResponse.json(rating)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
