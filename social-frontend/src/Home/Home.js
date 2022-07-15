import React, { useCallback, useEffect, useState } from 'react';

import Form from '../shared/components/FormElements/Form';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';
import Post from '../Post/components/Post';

const Home = (props) => {
  const [post, setPost] = useState({
    title: '',
    content: '',
    user: localStorage.getItem('userId'),
  });
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addPost = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'posts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify(post),
        }
      );
      const data = await response.json();
      console.log(data);
      setPost({
        ...post,
        title: '',
        content: '',
      });
      await getPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const updatePost = async (postId, postData) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `posts/${postId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify(postData),
        }
      );
      const data = await response.json();
      console.log(data);
      await getPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'posts/' + postId,
        {
          method: 'DELETE',
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      await getPosts();
    } catch (err) {
      console.log(err);
    }
  };

  const getPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'posts',
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      setPosts(data.posts);
      console.log(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const renderedPosts = (props.posts ? props.posts : posts).map((item) => (
    <Post
      deleted={deletePost}
      updated={updatePost}
      post={item}
      key={item._id}
    />
  ));

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      {!props.otherProfile ? (
        <Form onSubmit={addPost}>
          <Input
            name="title"
            type="text"
            value={post.title}
            onChange={(event) =>
              setPost({ ...post, title: event.target.value })
            }
          />
          <Input
            name="content"
            textarea
            value={post.content}
            onChange={(event) =>
              setPost({ ...post, content: event.target.value })
            }
          />
          <Button
            disabled={post.title.trim() === '' || post.content.trim() === ''}
            type="submit"
          >
            Submit
          </Button>
        </Form>
      ) : null}
      {renderedPosts}
    </div>
  );
};

export default Home;
