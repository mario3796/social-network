import React, { useCallback, useEffect, useState } from 'react';
import { useHttpClient } from '../shared/hooks/http-hook';
import Empty from '../shared/components/Empty/Empty';
import Button from '../shared/components/FormElements/Button';

import classes from './UserList.module.css';

const UserList = (props) => {
  const [users, setUsers] = useState([]);
  const { sendRequest } = useHttpClient();

  const getUsers = useCallback(async () => {
    try {
      const data = await sendRequest(
        process.env.REACT_APP_BACKEND_URL +
          'admin/users?userId=' +
          localStorage.getItem('userId'),
        'GET',
        null,
        {
          Authorization: localStorage.getItem('token'),
        }
      );
      setUsers(data.users);
    } catch (err) {
      console.log(err);
    }
  }, [sendRequest]);

  const deleteUser = async (userId) => {
    await sendRequest(
      process.env.REACT_APP_BACKEND_URL + 'admin/users/' + userId,
      'DELETE',
      null,
      {
        Authorization: localStorage.getItem('token'),
      }
    );
    await getUsers();
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const renderedUsers = users?.map((user) => {
    return (
      <tr key={user._id}>
        <td>{user._id}</td>
        <td>
          {user.image ? (
            <img
              style={{ width: '50px' }}
              src={process.env.REACT_APP_BACKEND_URL + user.image}
              alt=""
            />
          ) : (
            <p>No image added</p>
          )}
        </td>
        <td>{user.firstName + ' ' + user.lastName}</td>
        <td>{user.email}</td>
        <td>
          <Button link to={`/profile/` + user?._id}>
            Details
          </Button>
          <Button onClick={deleteUser.bind(this, user._id)} type="button">
            Delete
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div className={classes.UserList}>
      {users.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Profile Image</th>
              <th>UserName</th>
              <th>User Email</th>
            </tr>
          </thead>
          <tbody>{renderedUsers}</tbody>
        </table>
      ) : (
        <Empty>No Users Yet!</Empty>
      )}
    </div>
  );
};

export default UserList;
