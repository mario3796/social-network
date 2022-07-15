import React, { Fragment, useState } from 'react';

import Button from '../../shared/components/FormElements/Button';
import Form from '../../shared/components/FormElements/Form';
import Input from '../../shared/components/FormElements/Input';
import classes from './Post.module.css';

const Post = (props) => {
  const [Editing, setEditing] = useState(false);
  const [post, setPost] = useState({
    title: props.post.title,
    content: props.post.content,
    user: localStorage.getItem('userId'),
  });

  const onUpdate = (event) => {
    event.preventDefault();
    setEditing(false);
    props.updated(props.post._id, post);
  };

  return Editing ? (
    <Form onSubmit={onUpdate}>
      <Input
        type="text"
        name="title"
        defaultValue={props.post.title}
        onChange={(event) => setPost({ ...post, title: event.target.value })}
      />
      <Input
        textarea
        name="content"
        defaultValue={props.post.content}
        onChange={(event) => setPost({ ...post, content: event.target.value })}
      />
      <Button type="submit">Submit</Button>
    </Form>
  ) : (
    <div className={classes.Post}>
      <h1>
        <img
          src={process.env.REACT_APP_BACKEND_URL + props.post.user.image}
          alt=""
        />
        {props.post.user.firstName + ' ' + props.post.user.lastName}
      </h1>
      <h2>{props.post.title}</h2>
      <p>{props.post.content}</p>
      <br></br>
      {!props.viewed && (
        <Fragment>
          <Button link to={`/post-details/${props.post._id}`}>
            View
          </Button>
          {localStorage.getItem('userId') === props.post.user._id && (
            <Fragment>
              <Button type="button" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                type="button"
                onClick={props.deleted.bind(this, props.post._id)}
              >
                Delete
              </Button>
            </Fragment>
          )}
        </Fragment>
      )}
      <br></br>
      <br></br>
    </div>
  );
};

export default Post;
