import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../shared/hooks/http-hook';

import Card from '../shared/components/Card/Card';
import Empty from '../shared/components/Empty/Empty';
import Button from '../shared/components/FormElements/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';

const Friends = (props) => {
  let [friends, setFriends] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();
  const params = useParams();

  const getFriends = useCallback(async () => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'friends?userId=' + params.id,
      'GET',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    setFriends(data.friends);
  }, [params.id, sendRequest]);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

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
    await getFriends();
  };

  friends = friends?.map((friend) => (
    <Card
      style={{
        width: '25%',
        margin: '10px 100px 10px 100px',
        display: 'inline-block',
      }}
      image={process.env.REACT_APP_BACKEND_URL + friend.image}
      key={friend._id}
    >
      <h1>{friend.firstName + ' ' + friend.lastName}</h1>
      <Button link to={`/profile/${friend._id}`}>
        View Profile
      </Button>
      {localStorage.getItem('userId') !== friend._id.toString() && (
        <Button type="button" onClick={deleteFriend.bind(this, friend._id)}>
          UnFriend
        </Button>
      )}
    </Card>
  ));

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>{friends?.length > 0 ? friends : <Empty>No friend added!</Empty>}</div>
  );
};

export default Friends;
