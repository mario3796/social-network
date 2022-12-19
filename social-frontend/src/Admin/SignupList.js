import { useCallback, useEffect, useState } from 'react';
import { useHttpClient } from '../shared/hooks/http-hook';

import Card from '../shared/components/Card/Card';
import Button from '../shared/components/FormElements/Button';
import Empty from '../shared/components/Empty/Empty';

const SignupList = (props) => {
  let [requests, setRequests] = useState([]);
  const { sendRequest } = useHttpClient();

  const getRequests = useCallback(async () => {
    const data = await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'admin/requests',
      'GET',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    setRequests(data.requests);
  }, [sendRequest]);

  const handleRequest = async (requestId, handle = 'accept') => {
    let method = 'PUT';
    if (handle === 'reject') {
      method = 'DELETE';
    }
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL + `admin/requests/${requestId}`,
      method,
      null,
      {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'application/json',
      }
    );
    await getRequests();
  };

  requests = requests?.map((request) => {
    return (
      <Card
        image={process.env.REACT_APP_BACKEND_URL + request.user.image}
        key={request._id}
      >
        <h2>Email: {request.user.email}</h2>
        <h4>
          Username: {request.user.firstName + ' ' + request.user.lastName}
        </h4>
        <h4>User Type: {request.user.userType}</h4>
        <h4>Gender: {request.user.gender}</h4>
        <p>Created at: {request.createdAt}</p>
        <Button type="button" onClick={handleRequest.bind(this, request._id)}>
          Accept
        </Button>
        <Button
          type="button"
          onClick={handleRequest.bind(this, request._id, 'reject')}
        >
          Reject
        </Button>
      </Card>
    );
  });

  useEffect(() => {
    getRequests();
  }, [getRequests]);

  return (
    <div>
      {requests.length > 0 ? requests : <Empty>No Requests Found!</Empty>}
    </div>
  );
};

export default SignupList;
