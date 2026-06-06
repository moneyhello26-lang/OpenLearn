import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const community = await prisma.community.findUnique({
      where: { id: params.id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, avatar: true } } }
        }
      }
    })

    if (!community) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(community)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

// Join community
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const existing = await prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId: params.id, userId: user.userId } }
    })

    if (existing) return NextResponse.json({ error: 'Already joined' }, { status: 400 })

    const membership = await prisma.communityMember.create({
      data: { communityId: params.id, userId: user.userId }
    })

    return NextResponse.json(membership, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
