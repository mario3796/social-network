import { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';
import { AuthContext } from '../../context/auth-context';

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">Social Network</Link>
      </div>
      <div className={classes.left}>
        {authCtx.token && (
          <Fragment>
            <Link to="/home">Home</Link>
            <Link to="/search">Search</Link>
            {localStorage.getItem('userType') === 'admin' && (
              <Fragment>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/requests">Signup Requests</Link>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
      <div className={classes.right}>
        {authCtx.token ? (
          <Fragment>
            <Link to={`/profile/${localStorage.getItem('userId')}`}>
              Profile
            </Link>
            <button onClick={authCtx.logout}>Logout</button>
          </Fragment>
        ) : (
          <Fragment>
            <Link to="/signup">Sign up</Link>
            <Link to="/login">Login</Link>
          </Fragment>
        )}
      </div>
    </header>
  );
};

export default MainNavigation;
