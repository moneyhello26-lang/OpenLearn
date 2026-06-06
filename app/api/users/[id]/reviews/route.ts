import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const reviews = await prisma.userReview.findMany({
      where: { targetId: params.id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: reviews })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const authUser = verifyRequestToken(request)
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const { content } = await request.json()
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const review = await prisma.userReview.create({
      data: {
        authorId: authUser.userId,
        targetId: params.id,
        content,
      },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    })
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
