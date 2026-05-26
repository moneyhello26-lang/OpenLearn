import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ favoriteId: string }> }
) {
  try {
    const user = verifyRequestToken(request)

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { favoriteId } = await params

    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId },
    })

    if (!favorite || favorite.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    await prisma.favorite.delete({
      where: { id: favoriteId },
    })

    return NextResponse.json({ message: 'Favorite removed' })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
