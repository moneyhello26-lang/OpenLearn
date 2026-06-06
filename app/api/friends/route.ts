import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const friends = await prisma.friendship.findMany({
      where: {
        OR: [{ userId: user.userId }, { friendId: user.userId }],
        status: 'accepted'
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        friend: { select: { id: true, name: true, avatar: true } }
      }
    })

    const requests = await prisma.friendship.findMany({
      where: { friendId: user.userId, status: 'pending' },
      include: { user: { select: { id: true, name: true, avatar: true } } }
    })

    return NextResponse.json({ data: { friends, requests } })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { friendId } = await request.json()
    if (!friendId || friendId === user.userId) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: user.userId, friendId },
          { userId: friendId, friendId: user.userId }
        ]
      }
    })

    if (existing) return NextResponse.json({ error: 'Already requested' }, { status: 400 })

    const friendship = await prisma.friendship.create({
      data: { userId: user.userId, friendId }
    })

    await prisma.notification.create({
      data: {
        userId: friendId,
        type: 'friend_request',
        sourceId: friendship.id,
        content: 'Вам отправили заявку в друзья'
      }
    })

    return NextResponse.json(friendship, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
