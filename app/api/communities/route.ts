import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    // If not logged in, we could still show communities, but let's require auth for now
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const communities = await prisma.community.findMany({
      include: {
        _count: { select: { members: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: communities })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, description, coverUrl } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const community = await prisma.community.create({
      data: {
        name,
        description,
        coverUrl,
        creatorId: user.userId,
        members: {
          create: {
            userId: user.userId,
            role: 'admin'
          }
        }
      }
    })

    return NextResponse.json(community, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
