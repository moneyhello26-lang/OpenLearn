import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { 
        id: true, name: true, bio: true, avatar: true, createdAt: true,
        _count: {
          select: {
            favorites: true,
            courseFavorites: true,
            comments: true,
            ratings: true,
            courseRatings: true,
            courseComments: true
          }
        },
        favorites: {
          take: 4,
          orderBy: { addedAt: 'desc' },
          include: {
            book: { select: { id: true, title: true, author: true, coverUrl: true, sourceId: true } }
          }
        }
      },
    })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    // Format stats
    const stats = {
      totalFavorites: user._count.favorites,
      courseFavorites: user._count.courseFavorites,
      totalComments: user._count.comments + user._count.courseComments,
      totalRatings: user._count.ratings + user._count.courseRatings,
    }

    return NextResponse.json({ ...user, stats })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
