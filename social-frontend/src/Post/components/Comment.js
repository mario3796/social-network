import { Fragment, useState } from 'react';
import classes from './Comment.module.css';

import Button from '../../shared/components/FormElements/Button';
import Form from '../../shared/components/FormElements/Form';
import Input from '../../shared/components/FormElements/Input';

const Comment = (props) => {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(props.comment.content);

  const updated = async () => {
    await props.onUpdate(props.comment._id, content);
    setEditing(false);
  };

  return editing ? (
    <Form>
      <Input
        withoutLabel
        defaultValue={props.comment.content}
        textarea
        onChange={(event) => setContent(event.target.value)}
      />
      <Button type="button" disabled={content.trim() === ''} onClick={updated}>
        Update
      </Button>
      <Button type="button" onClick={() => setEditing(false)}>
        Cancel
      </Button>
    </Form>
  ) : (
    <div className={classes.Comment}>
      <h1>
        <img
          src={process.env.REACT_APP_BACKEND_URL + props.comment.user?.image}
          alt={props.comment.user._id}
        />
        {props.comment.user.firstName + ' ' + props.comment.user.lastName}
      </h1>
      <p>{props.comment.content}</p>
      {localStorage.getItem('userId') === props.comment.user._id && (
        <Fragment>
          <Button type="button" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button
            type="button"
            onClick={props.onDelete.bind(this, props.comment._id)}
          >
            Delete
          </Button>
        </Fragment>
      )}
    </div>
  );
};

export default Comment;
