import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: 'accepted',
        OR: [
          { userId: params.id },
          { friendId: params.id }
        ]
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        friend: { select: { id: true, name: true, avatar: true } }
      }
    })

    const friends = friendships.map(f => f.userId === params.id ? f.friend : f.user)
    return NextResponse.json(friends)
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
