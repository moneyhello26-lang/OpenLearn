import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyRequestToken } from '@/lib/auth'
import { handleApiError } from '@/lib/errors'

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const friendship = await prisma.friendship.findUnique({ where: { id: params.id } })
    if (!friendship || friendship.friendId !== user.userId) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.friendship.update({
      where: { id: params.id },
      data: { status: 'accepted' }
    })

    return NextResponse.json(updated)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const user = verifyRequestToken(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const friendship = await prisma.friendship.findUnique({ where: { id: params.id } })
    if (!friendship) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (friendship.userId !== user.userId && friendship.friendId !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.friendship.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
