import React, { useCallback, useEffect, useState } from 'react';
import { useHttpClient } from '../shared/hooks/http-hook';

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
  const { isLoading, sendRequest } = useHttpClient();

  const addPost = async (event) => {
    event.preventDefault();
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'posts',
      'POST',
      JSON.stringify(post),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    setPost({
      ...post,
      title: '',
      content: '',
    });
    
    props.getProfile ? await props.getProfile() : await getPosts();
  };

  const updatePost = async (postId, postData) => {
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL + `posts/${postId}`,
      'PUT',
      JSON.stringify(postData),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    props.getProfile ? await props.getProfile() : await getPosts();
  };

  const deletePost = async (postId) => {
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'posts/' + postId,
      'DELETE',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    props.getProfile ? await props.getProfile() : await getPosts();
  };

  const getPosts = useCallback(async () => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'posts',
      'GET',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    setPosts(data.posts);
  }, [sendRequest]);

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
