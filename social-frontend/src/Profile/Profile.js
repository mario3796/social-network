import { Fragment, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../shared/hooks/http-hook';

import Button from '../shared/components/FormElements/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';
import Home from '../Home/Home';
import classes from './Profile.module.css';
import Empty from '../shared/components/Empty/Empty';

const Profile = (props) => {
  const [profile, setProfile] = useState({
    user: null,
    posts: [],
  });
  const { isLoading, sendRequest } = useHttpClient();
  const params = useParams();

  let otherProfile = localStorage.getItem('userId') !== params.id;

  const getProfile = useCallback(async () => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'profile/' + params.id,
      'GET',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    setProfile({
      user: data.user,
      posts: data.posts,
    });
  }, [params.id, sendRequest]);

  const handleRequest = async (add) => {
    let url = process.env.REACT_APP_BACKEND_URL + 'requests';
    if (!add)
      url =
        process.env.REACT_APP_BACKEND_URL +
        'requests/' +
        localStorage.getItem('userId');
    await sendRequest(
      url,
      'PUT',
      JSON.stringify({
        sender: localStorage.getItem('userId'),
        requested: profile.user._id,
      }),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    await getProfile();
  };

  const deleteFriend = async (friendId) => {
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'friends',
      'PUT',
      JSON.stringify({
        userId: localStorage.getItem('userId'),
        friendId,
      }),
      {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      }
    );
    await getProfile();
  };

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      {profile.user ? (
        <Fragment>
          <div className={classes.Card}>
            <img
              src={process.env.REACT_APP_BACKEND_URL + profile.user.image}
              alt={profile.user._id}
            />
            <div className={classes.Container}>
              <h1>{profile.user.firstName + ' ' + profile.user.lastName}</h1>
              <h2>{profile.user.email}</h2>
              {otherProfile ? (
                profile.user.friends.includes(
                  localStorage.getItem('userId')
                ) ? (
                  <Button
                    type="button"
                    onClick={deleteFriend.bind(this, profile.user._id)}
                  >
                    UnFriend
                  </Button>
                ) : profile.user.receives.includes(
                    localStorage.getItem('userId')
                  ) ? (
                  <Button
                    type="button"
                    onClick={handleRequest.bind(this, false)}
                  >
                    Cancel Request
                  </Button>
                ) : profile.user.sends.includes(
                    localStorage.getItem('userId')
                  ) ? (
                  <Fragment>
                    <p>Friend Request Pending</p>
                    <br></br>
                  </Fragment>
                ) : (
                  <Button
                    type="button"
                    onClick={handleRequest.bind(this, true)}
                  >
                    Add Friend
                  </Button>
                )
              ) : (
                <Fragment>
                  <Button link to="/update-profile">
                    Update Profile
                  </Button>
                  <Button link to="/requests">
                    Friend Requests
                  </Button>
                </Fragment>
              )}
              <Button link to={`/friends/${params.id}`}>
                Friends
              </Button>
            </div>
          </div>
          <Home getProfile={getProfile} otherProfile={otherProfile} posts={profile.posts} />
        </Fragment>
      ) : (
        <Empty>Profile not Found!</Empty>
      )}
    </div>
  );
};

export default Profile;
