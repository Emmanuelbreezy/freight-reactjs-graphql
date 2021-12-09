import{ Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

const jwt = require('jsonwebtoken');

dotenv.config();
// CONFIG 
const JWT_SECRET = process.env.JWT_SECRET;

//Check if user is authenticated by verifing jwt returned in the request header
// if verification is successful set request.isAuthenticated = true and
// request.userId to the _id of the user
// else set request.isAuthenticated = false

export default function checkUserAuthenticated(req:any,res:Response,next:NextFunction) {
   const authHeader = req.get('Authorization');
   if(!authHeader){
       req.isAuthenticated = false;
       return next();
   }
   const token = authHeader.split(' ')[1];
   let decodedToken;

   try{
       decodedToken = jwt.verify(token, JWT_SECRET);
   }catch(err){
       req.isAuthenticated = false;
       return next();
   }

   if(!decodedToken){
       req.isAuthenticated = false;
        return next();
   }
   req.userId = decodedToken.userId;
   req.isAuthenticated = true;


   next()
};