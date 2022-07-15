import React, { useCallback, useEffect, useState } from 'react';

export const AuthContext = React.createContext({
  login: (payload) => {},
  logout: () => {},
  token: null,
});

let logoutTimer;

const calculateRemainingTime = (expiresIn) => {
  const currentTime = new Date().getTime();
  const expirationTime = new Date(expiresIn).getTime() * 1000;
  const duration = expirationTime - currentTime;
  return duration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationTime = +localStorage.getItem('expiresIn');
  const duration = calculateRemainingTime(storedExpirationTime);
  return {
    token: storedToken,
    duration,
  };
};

const AuthContextProvider = (props) => {
  let initialToken = null;
  const tokenData = retrieveStoredToken();
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const loginHandler = (payload) => {
    setToken(payload.token);
    localStorage.setItem('token', payload.token);
    localStorage.setItem('expiresIn', payload.expiresIn);
    localStorage.setItem('userId', payload.user._id);
    localStorage.setItem('userType', payload.user.userType);
    const duration = calculateRemainingTime(payload.expiresIn);
    logoutTimer = setTimeout(logoutHandler, duration);
  };

  const logoutHandler = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('expiresIn');
    setToken(null);
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      setTimeout(logoutHandler, tokenData.duration);
      console.log(tokenData);
    }
  }, [logoutHandler, tokenData]);

  const contextValue = {
    login: loginHandler,
    logout: logoutHandler,
    token,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
