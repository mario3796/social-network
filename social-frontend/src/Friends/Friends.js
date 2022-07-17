import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Card from '../shared/components/Card/Card';
import Empty from '../shared/components/Empty/Empty';
import Button from '../shared/components/FormElements/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';

const Friends = (props) => {
  let [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const getFriends = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'friends?userId=' + params.id,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      setFriends(data.friends);
      console.log(data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const deleteFriend = async (friendId) => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + 'friends',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: localStorage.getItem('token'),
        },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          friendId,
        }),
      }
    );
    const data = await response.json();
    console.log(data);
    await getFriends();
  };

  friends = friends?.map((friend) => (
    <Card
      style={{
        width: '25%',
        margin: '10px 100px 10px 100px',
        display: 'inline-block',
      }}
      image={friend.image}
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
