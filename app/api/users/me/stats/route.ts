import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const user = verifyRequestToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = user.userId

    const [
      booksRead,
      booksInProgress,
      totalFavorites,
      courseFavorites,
      totalComments,
      totalCourseComments,
      totalRatings,
      totalCourseRatings,
      userData,
    ] = await Promise.all([
      prisma.readingHistory.count({
        where: { userId, progress: { gte: 100 } },
      }),
      prisma.readingHistory.count({
        where: { userId, progress: { lt: 100 } },
      }),
      prisma.favorite.count({
        where: { userId },
      }),
      prisma.courseFavorite.count({
        where: { userId },
      }),
      prisma.comment.count({
        where: { userId },
      }),
      prisma.courseComment.count({
        where: { userId },
      }),
      prisma.rating.count({
        where: { userId },
      }),
      prisma.courseRating.count({
        where: { userId },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ])

    return NextResponse.json({
      booksRead,
      booksInProgress,
      totalFavorites,
      courseFavorites,
      totalComments: totalComments + totalCourseComments,
      totalRatings: totalRatings + totalCourseRatings,
      memberSince: userData?.createdAt,
    })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
