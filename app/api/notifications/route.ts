import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })
    
    const enriched = await Promise.all(notifications.map(async (n) => {
      if (n.type === 'friend_request' && n.sourceId) {
        const req = await prisma.friendship.findUnique({
          where: { id: n.sourceId },
          include: { user: { select: { id: true, name: true, avatar: true } } }
        })
        return { ...n, friendship: req }
      }
      return n
    }))

    return NextResponse.json({ data: enriched })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await prisma.notification.updateMany({
      where: { userId: user.userId, read: false },
      data: { read: true }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
