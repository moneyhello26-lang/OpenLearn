import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

// GET all comments for a course (visible to everyone)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseExtId = searchParams.get('courseId')
    if (!courseExtId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    }

    const comments = await prisma.courseComment.findMany({
      where: { courseExtId, parentId: null },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        replies: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: comments })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

// POST a comment or reply (requires auth)
export async function POST(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseExtId, content, parentId } = await request.json()

    if (!courseExtId || !content || content.trim().length === 0) {
      return NextResponse.json({ error: 'courseExtId and content are required' }, { status: 400 })
    }

    const comment = await prisma.courseComment.create({
      data: {
        userId: user.userId,
        courseExtId,
        content: content.trim(),
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        replies: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
