import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handleApiError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const { title, author, description, coverUrl, isbn, source, sourceId, downloadUrl, publishedDate, pageCount, language } = await request.json()

    if (!title || !author || !source || !sourceId) {
      return NextResponse.json(
        { error: 'Title, author, source, and sourceId are required' },
        { status: 400 }
      )
    }

    const existingBook = await prisma.book.findUnique({
      where: {
        source_sourceId: {
          source,
          sourceId,
        },
      },
    })

    if (existingBook) {
      return NextResponse.json(existingBook)
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        coverUrl,
        isbn,
        source,
        sourceId,
        downloadUrl,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        pageCount,
        language,
      },
    })

    return NextResponse.json(book, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      try {
        const { source, sourceId } = await request.json().catch(() => ({}))
        if (source && sourceId) {
          const existingBook = await prisma.book.findUnique({
            where: { source_sourceId: { source, sourceId } },
          })
          if (existingBook) return NextResponse.json(existingBook)
        }
      } catch {}
      return NextResponse.json(
        { error: 'Book already exists' },
        { status: 400 }
      )
    }
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') || '10'))
    const search = searchParams.get('search')
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { author: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const books = await prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.book.count({ where })

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
