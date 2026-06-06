import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string, reviewId: string }> }) {
  try {
    const params = await props.params;
    const authUser = verifyRequestToken(request)
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    const review = await prisma.userReview.findUnique({ where: { id: params.reviewId } })
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (review.authorId !== authUser.userId && review.targetId !== authUser.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.userReview.delete({ where: { id: params.reviewId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
