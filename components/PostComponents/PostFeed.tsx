import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Post from './Post'; // A component to render individual post - You might need to implement it
import styles from './styles/PostFeed.module.css';
import { Post as PostType } from '@/app/types';

const PostFeed: React.FC = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetchUserFeed();
  }, [session]);

  const fetchUserFeed = async () => {
    if (session) {
      setAuthenticated(true);
      try {
        const { data } = await axios.get('/api/content');
        // Transform data into a proper PostType array
        const posts = data.map((post: any): PostType => ({
          ...post,
          createdAt: new Date(post.createdAt),
        }));
        setPosts(
          posts.sort((a: PostType, b: PostType) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
          })
        );
      } catch (error) {
        console.error('Error fetching user feed', error);
      }
    } else {
      setAuthenticated(false);
    }
  };
  

  if (!authenticated) {
    return <p>Make some friends, nerd</p>;
  }

  return (
    <div className={styles.container}>
      {posts.map((post) => (
        <Post key={post.id} post={post} /> // This Post component needs to be created
      ))}
    </div>
  );
};

export default PostFeed;
