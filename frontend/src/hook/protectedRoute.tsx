import React from "react";
import { Navigate} from 'react-router-dom';

function checkAuth(){
  const _token = localStorage.getItem('token');
    const _userId = localStorage.getItem('userId');
    const isAuth = _token && _userId ? true : false;

    return isAuth;
}


const ProtectedRoute = ({ children }:any) => {

  const isAuthenticated = checkAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;