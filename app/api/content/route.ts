import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/prisma'

// Helper function to check if the user is authenticated
async function isAuthenticated() {
  const session = await getServerSession()
  if (!session) {
    return { authenticated: false, response: NextResponse.json({ error: 'You must be signed in to call this endpoint' }, { status: 401 }) }
  }
  return { authenticated: true, session }
}

export async function GET(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth.authenticated) {
    return auth.response
  }

  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 })
  }

  try {
    // Query Posts table with prisma where a feed populates of the authenticated user's posts + followers
    const followingIds = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    })

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: userId },
          {
            authorId: {
              in: followingIds.map(f => f.followingId),
            },
          },
        ],
      },
      select: {
        content: true,
        author: true,
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth.authenticated) {
    return auth.response
  }

  try {
    const body = await request.json()
    const { userId, content } = body

    if (!userId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Data sanitization and write user's post to prisma database
    const post = await prisma.post.create({
      data: {
        content,
        author: {
          connect: { id: userId },
        },
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await isAuthenticated()
  if (!auth.authenticated) {
    return auth.response
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Post id is required' }, { status: 400 })
    }

    // Remove the post from database
    const post = await prisma.post.delete({
      where: { id },
    })

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}