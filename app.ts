import express, { Request, Response, NextFunction } from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import {graphqlHTTP} from 'express-graphql';
import graphqlSchema from './graphql/schema';
import graphqlResolver from './graphql/resolver';
import checkUserAuthenticated from './middleware/checkUserAuthenticated';

import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = 'mongodb+srv://Emmanuel:B55nWv_-JL2N-Xw@cluster0.wo1wx.mongodb.net/shipment';


// CONFIG 
const enviroment = process.env.NODE_ENV;
const mongodb_uri:any = process.env.MONGODB_URI;
const port            = process.env.PORT || process.env.LOCAL_PORT;


var app = express();

app.use(bodyparser.json());
app.use((req:Request,res:Response, next:NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
});

app.use(checkUserAuthenticated);

app.use('/graphql', graphqlHTTP({
    schema:graphqlSchema,
    rootValue:graphqlResolver,
    graphiql:true,
    formatError(err:any){
        if(!err.originalError){
            return err;
        }
        const data = err.originalError.data;
        const message = err.message || 'An error occurred';
        const code = err.originalError.code || 500;
        return {
            message: message,
            status: code,
            data: data
        }

    }
}))

app.use((error:any,req:Request,res:Response, next:NextFunction) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message:message
    });
});



mongoose.connect(MONGODB_URI)
  .then( (result:any) => {
      app.listen(port, () => console.log('Server is running on port 5000'))
}).catch((err:any) => console.log(err))