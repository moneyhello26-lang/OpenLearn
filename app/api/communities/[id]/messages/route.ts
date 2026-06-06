import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const messages = await prisma.communityMessage.findMany({
      where: { communityId: params.id },
      include: { user: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ data: messages.reverse() })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const membership = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: params.id, userId: user.userId } }
    })

    if (!membership) return NextResponse.json({ error: 'Must join community first' }, { status: 403 })

    const { content, bookLink } = await request.json()
    if (!content && !bookLink) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const message = await prisma.communityMessage.create({
      data: {
        communityId: params.id,
        userId: user.userId,
        content: content || '',
        bookLink
      },
      include: { user: { select: { id: true, name: true, avatar: true } } }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
