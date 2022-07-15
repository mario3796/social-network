import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import classes from './Button.module.css';

const Button = (props) => {
  let button = (
    <button
      disabled={props.disabled}
      className={classes.Button}
      type={props.type}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );

  if (props.link) {
    button = (
      <Link to={props.to} className={classes.Link}>
        {props.children}
      </Link>
    );
  }
  return <Fragment>{button}</Fragment>;
};

export default Button;
