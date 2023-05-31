import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import styles from './styles/Post.module.css';

interface PostProps {
  post: {
    id: string;
    content: string;
    author: string;
    createdAt: Date;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { data: session } = useSession();
  const [posted, setPosted] = useState(false);
  const [postId, setPostId] = useState(post.id);

  useEffect(() => {
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    if (postId !== '') {
      try {
        const { data } = await axios.get(`/api/content/${postId}`);
        if (data) {
          setPosted(true);
        }
      } catch (error) {
        console.error('Error fetching post data', error);
      }
    }
  };

  return (
    <div className={styles.post}>
      <img className={styles.profilePic} src={session?.user?.image || ''} alt="Profile pic" />
      <div className={styles.content}>
        <p className={styles.author}>{post.author}</p>
        <p className={styles.postContent}>{post.content}</p>
        <p className={styles.timestamp}>{new Date(post.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Post;
