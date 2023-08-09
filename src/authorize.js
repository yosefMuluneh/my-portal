import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from './context';
const withAuth = (Component) => {
  const AuthRoute = (props) => {
    const {login}=useLoginContext()
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('token');
    const history = useNavigate()
    useEffect(() => {
      // Redirect to login page if the user is not authenticated
      if (!login) {
        history('/');
      }
    }, [isAuthenticated]);

    // Render the component if the user is authenticated
    return isAuthenticated ? <Component {...props} /> : null;
  };

  return AuthRoute;
};

export default withAuth;