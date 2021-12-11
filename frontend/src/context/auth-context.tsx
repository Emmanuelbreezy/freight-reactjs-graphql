import React from 'react';

interface ContextValues{
    isAuthenticated:boolean;
    userId:string|null;
    token:string|null;
    isLogout:any;
}

const AuthContext = React.createContext<ContextValues>({
    isAuthenticated:false,
    userId: '',
    token: '',
    isLogout:() => {}
});

export default AuthContext;