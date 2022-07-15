import React from 'react';
import classes from './ErrorMessage.module.css';

const ErrorMessage = (props) => (
  <div className={classes.ErrorMessage}>
    <p>{props.children}</p>
  </div>
);

export default ErrorMessage;
