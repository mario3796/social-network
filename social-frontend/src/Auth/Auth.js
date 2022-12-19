import React, { Fragment, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttpClient } from '../shared/hooks/http-hook';

import Form from '../shared/components/FormElements/Form';
import Input from '../shared/components/FormElements/Input';
import Button from '../shared/components/FormElements/Button';
import ErrorMessage from '../shared/components/Error/ErrorMessage';
import { AuthContext } from '../shared/context/auth-context';

const Auth = (props) => {
  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    gender: '',
    userType: '',
    password: '',
    confirmPassword: '',
  });
  const userTypeSelect = ['user', 'admin'];
  const genderSelect = ['male', 'female'];
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const { sendRequest, error } = useHttpClient();

  const submitHandler = async (event) => {
    event.preventDefault();
    let url = process.env.REACT_APP_BACKEND_URL + 'login';
    if (!props.isLogin) {
      url = process.env.REACT_APP_BACKEND_URL + 'signup';
    }
    const data = await sendRequest(url, 'POST', JSON.stringify(user), {
      'Content-Type': 'application/json',
    });
    if (props.isLogin) {
      authCtx.login(data);
    }
    history.push('/');
  };

  return (
    <Form onSubmit={submitHandler}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Input
        name="email"
        type="text"
        onChange={(event) => setUser({ ...user, email: event.target.value })}
      />
      <Input
        name="password"
        type="password"
        onChange={(event) => setUser({ ...user, password: event.target.value })}
      />
      {!props.isLogin && (
        <Fragment>
          <Input
            name="confirmPassword"
            type="password"
            onChange={(event) =>
              setUser({ ...user, confirmPassword: event.target.value })
            }
          />
          <Input
            name="firstName"
            type="text"
            onChange={(event) =>
              setUser({ ...user, firstName: event.target.value })
            }
          />
          <Input
            name="lastName"
            type="text"
            onChange={(event) =>
              setUser({ ...user, lastName: event.target.value })
            }
          />
          <Input
            name="userType"
            defaultValue={user.userType}
            select={userTypeSelect}
            onChange={(event) =>
              setUser({ ...user, userType: event.target.value })
            }
          />
          <Input
            name="gender"
            defaultValue={user.gender}
            select={genderSelect}
            onChange={(event) =>
              setUser({ ...user, gender: event.target.value })
            }
          />
        </Fragment>
      )}
      <Button type="submit">{props.isLogin ? 'Login' : 'Sign up'}</Button>
    </Form>
  );
};

export default Auth;
