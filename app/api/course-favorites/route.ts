import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await prisma.courseFavorite.findMany({
      where: { userId: user.userId },
      orderBy: { addedAt: 'desc' },
    })

    return NextResponse.json({ data: favorites })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseExtId, title, coverUrl, instructor } = await request.json()
    if (!courseExtId) {
      return NextResponse.json({ error: 'courseExtId is required' }, { status: 400 })
    }

    const existing = await prisma.courseFavorite.findFirst({
      where: { userId: user.userId, courseExtId },
    })

    if (existing) {
      await prisma.courseFavorite.delete({ where: { id: existing.id } })
      return NextResponse.json({ favorited: false })
    }

    const fav = await prisma.courseFavorite.create({
      data: {
        userId: user.userId,
        courseExtId,
        title: title || '',
        coverUrl: coverUrl || null,
        instructor: instructor || '',
      },
    })

    return NextResponse.json({ favorited: true, data: fav }, { status: 201 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
