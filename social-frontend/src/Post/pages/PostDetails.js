import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Post from '../components/Post';
import Comment from '../components/Comment';
import Form from '../../shared/components/FormElements/Form';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Empty from '../../shared/components/Empty/Empty';
import LoadingSpinner from '../../shared/components/LoadingSpinner/LoadingSpinner';

const PostDetails = (props) => {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addComment = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'comments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify({
            user: localStorage.getItem('userId'),
            post: params.id,
            content,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setContent('');
      await getPost();
    } catch (err) {
      console.log(err);
    }
  };

  const getPost = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `posts/${params.id}`,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setPost(data.post);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [params.id]);

  const updateComment = async (commentId, content) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `comments/${commentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify({
            post: params.id,
            content,
            user: localStorage.getItem('userId')
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      await getPost();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `comments/${commentId}?post=${params.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      await getPost();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPost();
  }, [getPost]);

  let comments = post?.comments.map((comment) => (
    <Comment
      postId={params.id}
      comment={comment}
      onUpdate={updateComment}
      onDelete={deleteComment}
      key={comment._id}
    />
  ));

  return isLoading ? (
    <LoadingSpinner />
  ) : post ? (
    <div>
      <Post post={post} viewed />
      <Form onSubmit={addComment} style={{ borderWidth: 0 }}>
        <Input
          textarea
          defaultValue={content}
          placeholder="Add Comment"
          onChange={(event) => setContent(event.target.value)}
          withoutLabel
        />
        <Button type="submit" disabled={content?.trim() === ''}>
          Submit
        </Button>
      </Form>
      {comments}
    </div>
  ) : (
    <Empty>There is no such a post!</Empty>
  );
};

export default PostDetails;
