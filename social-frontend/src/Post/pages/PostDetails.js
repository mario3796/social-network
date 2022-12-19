import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook';

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
  const { isLoading, sendRequest } = useHttpClient();

  const addComment = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + 'comments',
        'POST',
        JSON.stringify({
          user: localStorage.getItem('userId'),
          post: params.id,
          content,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        }
      );
      setContent('');
      await getPost();
    } catch (err) {
      console.log(err);
    }
  };

  const getPost = useCallback(async () => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + `posts/${params.id}`,
      'GET',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    setPost(data.post);
  }, [params.id, sendRequest]);

  const updateComment = async (commentId, content) => {
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL + `comments/${commentId}`,
      'PUT',
      JSON.stringify({
        post: params.id,
        content,
        user: localStorage.getItem('userId'),
      }),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    await getPost();
  };

  const deleteComment = async (commentId) => {
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL +
        `comments/${commentId}?post=${params.id}`,
      'DELETE',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    await getPost();
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
