import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    if (!q) return NextResponse.json({ results: [] })

    const communities = await prisma.community.findMany({
      where: { name: { contains: q } },
      include: { _count: { select: { members: true } } },
      take: 20
    })

    return NextResponse.json({ results: communities })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
