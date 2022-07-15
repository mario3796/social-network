import React from 'react';

import classes from './Empty.module.css';

const Empty = (props) => (
  <div className={classes.Empty}>
    <p>{props.children}</p>
  </div>
);

export default Empty;
