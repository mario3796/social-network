import { Route, Switch, Redirect } from 'react-router-dom';
import { useContext } from 'react';

import Layout from './shared/components/Layout/Layout';
import Home from './Home/Home';
import Auth from './Auth/Auth';
import PostDetails from './Post/pages/PostDetails';
import UserList from './Admin/UserList';
import { AuthContext } from './shared/context/auth-context';
import SignupList from './Admin/SignupList';
import Profile from './Profile/Profile';
import UpdateProfile from './Profile/UpdateProfile';
import FriendRequests from './Friends/FriendRequests';
import Friends from './Friends/Friends';
import Search from './Search/Search';
import NotFound from './shared/pages/NotFound';

function App() {
  const authCtx = useContext(AuthContext);
  let routes = (
    <Switch>
      <Route path="/" exact>
        {authCtx.token ? <Redirect to="/home" /> : <Redirect to="/login" />}
      </Route>
      <Route path="/home">
        {authCtx.token ? <Home /> : <Redirect to="/login" />}
      </Route>
      <Route path="/signup">
        {!authCtx.token ? <Auth /> : <Redirect to="/" />}
      </Route>
      <Route path="/login">
        {!authCtx.token ? <Auth isLogin /> : <Redirect to="/" />}
      </Route>
      <Route path="/post-details/:id">
        {authCtx.token ? <PostDetails /> : <Redirect to="/" />}
      </Route>
      <Route path="/profile/:id">
        {authCtx.token ? <Profile /> : <Redirect to="/" />}
      </Route>
      <Route path="/update-profile">
        {authCtx.token ? <UpdateProfile /> : <Redirect to="/" />}
      </Route>
      <Route path="/requests">
        {authCtx.token ? <FriendRequests /> : <Redirect to="/" />}
      </Route>
      <Route path="/friends/:id">
        {authCtx.token ? <Friends /> : <Redirect to="/" />}
      </Route>
      <Route path="/search">
        {authCtx.token ? <Search /> : <Redirect to="/" />}
      </Route>
      <Route path="/admin/users">
        {authCtx.token && localStorage.getItem('userType') === 'admin' ? (
          <UserList />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route path="/admin/requests">
        {authCtx.token && localStorage.getItem('userType') === 'admin' ? (
          <SignupList />
        ) : (
          <Redirect to="/" />
        )}
      </Route>
      <Route path="*" component={NotFound} />
    </Switch>
  );
  return <Layout>{routes}</Layout>;
}

export default App;
