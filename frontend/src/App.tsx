import React, { useEffect, useState } from 'react';
import {Routes, Route , useNavigate,Navigate} from "react-router-dom";
import Detail from './views/Detail/Detail';
import Register from './views/Auth/Register/Register';
import Login from './views/Auth/Login/Login';
import ProtectedRoute from './hook/protectedRoute';
import ListShipment from './views/ListShipment/ListShipment';
import Dashboard from './views/Dashboard/Dashboard';
import CreateShipment from './views/CreateShipment/CreateShipment';
import UpdateShipment from './views/UpdateShipment/UpdateShipment';
import AuthContext from './context/auth-context';
import AuthRoute from './hook/authRoute';

function verifyAuth(){
  const _token:any = localStorage.getItem('token');
  const _userId:any = localStorage.getItem('userId');
  const checkAuth:boolean = _token && _userId ? true : false;

  return [_token,_userId,checkAuth];
 
}


function App() {
  const navigator = useNavigate();
  const [_token,_userId,checkAuth] = verifyAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string|null>('');
  const [token, setToken] = useState<string|null>('');

  useEffect(() => {
    if(checkAuth){
      setIsAuthenticated(checkAuth);
      setUserId(_userId);
      setToken(_token);
    }
  },[_token,_userId,checkAuth])

  const logoutHandler = () =>{
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigator('/login');
  }



  return (
    <AuthContext.Provider value={{
      isAuthenticated:isAuthenticated,
      userId:userId,
      token:token,
      isLogout:logoutHandler
    }}>
      <Routes >
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Register  /></AuthRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateShipment/></ProtectedRoute>} />
        <Route path="/shipment/update" element={<ProtectedRoute><UpdateShipment/></ProtectedRoute>} />
        <Route path="/shipment/:id/" element={<ProtectedRoute><Detail/></ProtectedRoute>} />
        <Route path="/dashboard/allshipment/" element={<ProtectedRoute><ListShipment/></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<div style={{textAlign:"center",fontSize:"1.5rem"}}>404 Error</div>} />
      </Routes>

    </AuthContext.Provider>
  );
}

export default App;
