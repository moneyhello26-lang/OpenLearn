import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    if (!q) return NextResponse.json({ results: [] })

    const users = await prisma.user.findMany({
      where: { name: { contains: q } },
      select: { id: true, name: true, avatar: true, bio: true },
      take: 20
    })

    return NextResponse.json({ results: users })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
