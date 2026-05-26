import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        ratings: {
          select: {
            score: true,
            user: { select: { name: true } },
          },
        },
        comments: {
          take: 5,
          include: { user: { select: { name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(book)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
