import React, { useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../shared/components/FormElements/Button';
import Form from '../shared/components/FormElements/Form';
import Input from '../shared/components/FormElements/Input';
import ErrorMessage from '../shared/components/Error/ErrorMessage';

const UpdateProfile = (props) => {
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    image: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const history = useHistory();
  const genderSelect = ['male', 'female'];
  const [error, setError] = useState(null);

  const updateProfile = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', user.email);
      formData.append('firstName', user.firstName);
      formData.append('lastName', user.lastName);
      formData.append('gender', user.gender);
      formData.append('password', user.password);
      formData.append('confirmPassword', user.confirmPassword);
      formData.append('image', user.image);
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          `update?userId=${localStorage.getItem('userId')}`,
        {
          method: 'POST',
          headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      console.log(data);
      history.push('/');
    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  const getProfile = useCallback(async () => {
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL +
          'profile/' +
          localStorage.getItem('userId'),
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setUser({ ...data.user, password: '', confirmPassword: '' });
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <Form onSubmit={updateProfile} enctype="multipart/form-data">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        name="email"
        type="text"
        defaultValue={user.email}
        value={user.email}
        onChange={(event) => setUser({ ...user, email: event.target.value })}
      />
      <Input
        name="firstName"
        type="text"
        defaultValue={user.firstName}
        value={user.firstName}
        onChange={(event) =>
          setUser({ ...user, firstName: event.target.value })
        }
      />
      <Input
        name="lastName"
        type="text"
        defaultValue={user.lastName}
        value={user.lastName}
        onChange={(event) => setUser({ ...user, lastName: event.target.value })}
      />
      <Input
        name="gender"
        select={genderSelect}
        defaultValue={user.gender}
        value={user.gender}
        onChange={(event) => setUser({ ...user, gender: event.target.value })}
      />
      {/* <Input
        name="image"
        type="file"
        accept=".png, .jpg, .jpeg"
        onChange={(event) => setUser({ ...user, image: event.target.files[0] })}
      /> */}
      <Input
        name="password"
        type="password"
        onChange={(event) => setUser({ ...user, password: event.target.value })}
      />
      <Input
        name="confirmPassword"
        type="password"
        onChange={(event) =>
          setUser({ ...user, confirmPassword: event.target.value })
        }
      />
      <Input
        name="imageURL"
        type="text"
        defaultValue={user.image}
        value={user.image}
        onChange={(event) => setUser({ ...user, image: event.target.value })}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};

export default UpdateProfile;
