// Import necessary packages and components
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import useRouter from 'next/router';
import { Post as PostType } from '@/app/types';
import PostForm from '@/components/PostComponents/PostForm';
import PostFeed from '@/components/PostComponents/PostFeed';

export default function UserPostFeed({ posts }: { posts: PostType[] }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Posts by {id}</h1>
      <PostForm />
      <PostFeed posts={posts} />
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { authorId: session.user.id },
        {
          author: {
            followedBy: {
              some: {
                followerId: session.user.id,
              },
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: true, // Include the details of the author
    },
  });

  return {
    props: { posts },
  };
}
