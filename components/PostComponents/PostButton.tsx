import React, { useState } from 'react';
import axios from 'axios';
import useRouter from 'next/router';
import styles from './PostForm.module.css';

interface PostButtonProps {
  defaultContent?: string;
}

const PostButton: React.FC<PostButtonProps> = ({ defaultContent = '' }) => {
  const [content, setContent] = useState<string>(defaultContent);
  const [buttonColor, setButtonColor] = useState<string>('grey');
  const router = useRouter();

  const postUserContent = async () => {
    if (content.length > 1) {
      setButtonColor('blue');
      try {
        await axios.post('/api/content', { content });
        setContent('');
        router.push('/');
      } catch (error) {
        console.error('Error posting content', error);
      }
    } else {
      setButtonColor('grey');
    }
  };

  return (
    <button className={ styles.button } style={{ backgroundColor: buttonColor }} onClick={postUserContent}>
    Post
    </button>
  );
};

export default PostButton;
