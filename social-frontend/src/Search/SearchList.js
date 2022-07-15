import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import classes from './SearchList.module.css';

const SearchList = (props) => {
  let [users, setUsers] = useState([]);

  const getUsers = useCallback(async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + 'users',
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setUsers(data.users);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const filteredUsers = users.filter((el) => {
    if (props.input.trim() === '') {
      return null;
    } else {
      return (el.firstName + ' ' + el.lastName)
        .toLowerCase()
        .includes(props.input.trim());
    }
  });

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>
      {filteredUsers.map((user) => (
        <Link to={`/profile/${user._id}`} className={classes.link}>
          <img
            src={process.env.REACT_APP_BACKEND_URL + user.image}
            alt={user.image}
          />
          <div className={classes.container}>
            <h2>{user.firstName + ' ' + user.lastName}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchList;
