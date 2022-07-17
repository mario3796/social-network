import { useCallback, useEffect, useState } from 'react';
import Card from '../shared/components/Card/Card';
import Empty from '../shared/components/Empty/Empty';
import Button from '../shared/components/FormElements/Button';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';

const FriendRequests = (props) => {
  let [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `requests?userId=${localStorage.getItem('userId')}`,
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setRequests(data.requests);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }, []);

  const handleRequest = async (userId, add) => {
    let method;
    add ? (method = 'POST') : (method = 'PUT');
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'requests/' + userId,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
          body: JSON.stringify({
            requested: localStorage.getItem('userId'),
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      await getRequests();
    } catch (err) {
      console.log(err);
    }
  };

  requests = requests?.map((request) => {
    return (
      <Card
        image={request.image}
        key={request._id}
      >
        <h2>Email: {request.email}</h2>
        <h4>Username: {request.firstName + ' ' + request.lastName}</h4>
        <h4>User Type: {request.userType}</h4>
        <p>Created at: {request.createdAt}</p>
        <Button
          type="button"
          onClick={handleRequest.bind(this, request._id, true)}
        >
          Accept
        </Button>
        <Button
          type="button"
          onClick={handleRequest.bind(this, request._id, false)}
        >
          Reject
        </Button>
      </Card>
    );
  });

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div>
      {requests.length > 0 ? requests : <Empty>No Requests Found!</Empty>}
    </div>
  );
};

export default FriendRequests;
