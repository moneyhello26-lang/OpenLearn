import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseExtId = searchParams.get('courseId')
    if (!courseExtId) return NextResponse.json({ error: 'courseId required' }, { status: 400 })

    const ratings = await prisma.courseRating.findMany({ where: { courseExtId } })
    const avg = ratings.length > 0
      ? ratings.reduce((s, r) => s + r.score, 0) / ratings.length
      : 0

    return NextResponse.json({ average: avg, count: ratings.length })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseExtId, score } = await request.json()
    if (!courseExtId || !score) return NextResponse.json({ error: 'courseExtId and score required' }, { status: 400 })

    const rating = await prisma.courseRating.upsert({
      where: { userId_courseExtId: { userId: user.userId, courseExtId } },
      create: { userId: user.userId, courseExtId, score },
      update: { score },
    })

    return NextResponse.json(rating)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
