import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import PostButton from './PostButton';
import styles from './PostForm.module.css';
import { Post as PostType } from '@/app/types'

const defaultPost: PostType = {
  id: '',
  content: '',
  author: '',
  authorId: '',
  createdAt: new Date(),
};

const PostForm: React.FC = () => {
  const { data: session } = useSession();
  const [postdata, setPostdata] = useState<PostType>(defaultPost);

  const fetchPostContent = async (content: string) => {
    if (content !== defaultPost.content && session) {
      const newPost: PostType = {
        ...defaultPost, // spread the defaultPost values
        id: uuidv4(),
        content: content,
        createdAt: new Date(), // Generate new Date here
        author: session.user?.name || '', // User's name from session
        authorId: session.user?.email || '', // User's id from session
      };
      setPostdata(newPost);
      try {
        await axios.post('/api/content', newPost);
        toast('Successfully Posted!');
        setPostdata(defaultPost);
      } catch (error) {
        console.error('Error posting content', error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <textarea
        className={styles.textarea}
        value={postdata.content}
        onChange={(e) => setPostdata({ ...postdata, content: e.target.value })}
        placeholder="if young metro don't trust ya i'm gon shoot ya"
      />
      <PostButton defaultContent={postdata.content} />
    </div>
  );
};

export default PostForm;
