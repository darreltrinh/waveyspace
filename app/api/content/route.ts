import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

// Helper function to check if the user is authenticated
async function isAuthenticated(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    res.status(401).json({ error: 'You must be signed in to call this endpoint' })
    return false
  }
  return true
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method
  const userId = req.body.userId

  if (method === 'GET') {
    if (await isAuthenticated(req, res)) {
      // Query Posts table with prisma where a feed populates of the authenticated user's posts + followers
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { authorId: userId },
            {
              authorId: {
                in: await prisma.follows.findMany({
                  where: { followerId: userId },
                  select: { followingId: true },
                }),
              },
            },
          ],
        },
        select: {
          content: true,
          author: true,
        },
      })
      res.status(200).json(posts)
    }
  } else if (method === 'POST') {
    if (await isAuthenticated(req, res)) {
      const postData = req.body
      // Data sanitization and write user's post to prisma database
      const post = await prisma.post.create({
        data: {
          title: postData.title,
          content: postData.content,
          slug: postData.slug,
          author: {
            connect: { id: userId },
          },
        },
      })
      res.status(201).json(post)
    }
  } else if (method === 'DELETE') {
    if (await isAuthenticated(req, res)) {
      const { slug } = req.body
      // Remove the post from database
      const post = await prisma.post.delete({
        where: { slug: slug },
      })
      res.status(200).json(post)
    }
  } else {
    res.status(405).end() // Method not allowed
  }
}
