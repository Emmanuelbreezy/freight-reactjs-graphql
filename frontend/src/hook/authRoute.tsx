import React,{useContext} from "react";
import { Navigate} from 'react-router-dom';

function checkAuth(){
  const _token = localStorage.getItem('token');
    const _userId = localStorage.getItem('userId');
    const isAuth = _token && _userId ? true : false;

    return isAuth;
}

const AuthRoute = ({ children }:any) => {

  const isAuthenticated = checkAuth();
  
  
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRoute;