import React from 'react';
import classes from './Form.module.css';

const Form = (props) => {
  return (
    <div className={classes.Form} style={props.style}>
      <form onSubmit={props.onSubmit} encType={props.encType} noValidate>
        {props.children}
      </form>
    </div>
  );
};

export default Form;
