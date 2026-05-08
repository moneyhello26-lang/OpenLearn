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

    const comments = await prisma.comment.findMany({
      where: { bookId, parentId: null },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        replies: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.comment.count({ where: { bookId } })

    return NextResponse.json({ data: comments, total })
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
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { bookId } = await params
    const { content, parentId } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 })
    }

    const book = await prisma.book.findUnique({ where: { id: bookId } })
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })

    const comment = await prisma.comment.create({
      data: {
        userId: user.userId,
        bookId,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        replies: { include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
