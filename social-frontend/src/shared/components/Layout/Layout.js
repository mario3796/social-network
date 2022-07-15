import classes from './Layout.module.css';

import MainNavigation from './MainNavigation';

const Layout = (props) => {
  return (
    <div className={classes.Layout}>
      <MainNavigation />
      <main>{props.children}</main>
    </div>
  );
};

export default Layout;
