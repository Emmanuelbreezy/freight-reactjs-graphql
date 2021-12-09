import bcrypt from 'bcrypt';
import validator from 'validator';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Shipment from '../models/shipment.model';
import {random_userId_generator, random_shipmentId_generator} from '../utils/random_code_gen';

dotenv.config();
// CONFIG 
const JWT_SECRET:any = process.env.JWT_SECRET;


 export default  {
    // Signup user
    createUser: async function({userInput}:any,req:any){
        const _name = userInput.name;
        const _email = userInput.email;
        const _password = userInput.password;
        // Using Javascript to generate code for userId
        const _userId   = random_userId_generator()

        const errors = [];
         
        if(!validator.isEmail(_email)){
            errors.push({ message: 'E-mail is invalid'});
        }

        if(validator.isEmpty(_password)){
            errors.push({message: 'Password is empty'});
        }

        if(errors.length > 0){
            const error:any = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const existingUser = await User.findOne({email: _email})
        if(existingUser){
            const error  =  new Error('User exists already!');
            throw error;
        }

        const hashedPw = await bcrypt.hash(_password, 12);
        const user = new User({
            userId: _userId,
            email: _email,
            name: _name,
            password: hashedPw
        });
        const createdUser = await user.save();
        return {...createdUser._doc, _id: createdUser._id.toString()}

    },

    //Login user by sending jwt token

    login: async function({email,password}:any,req:any){
        const user = await User.findOne({email:email}); 
        console.log(user);
        if(!user){
            const error:any = new Error('User not found');
            error.code =  401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual){
            const error:any = new Error('Password is incorrect');
            error.code =  401;
            throw error;
        }

        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        },
        JWT_SECRET,
        {expiresIn:'4h'}
        
        );

        return {
            token:token,
            userId: user._id.toString()
        }


    },

    //Verify User jwt token before creating shipment

    createShipment: async function({shipmentInput}:any, req:any){
        if(!req.isAuthenticated){
            const error:any = new Error('user not authenticated');
            error.code = 401;
            throw error;
        }
        const errors = [];
        
        if(validator.isEmpty(shipmentInput.name)){
            errors.push({ message: 'Name is required'});
        }

        if(validator.isEmpty(shipmentInput.mode)){
            errors.push({ message: 'Shipping Mode is required'});
        }

        if(validator.isEmpty(shipmentInput.type)){
            errors.push({ message: 'Shipping Type is required'});
        }

        if(validator.isEmpty(shipmentInput.destination)){
            errors.push({ message: 'Shipping Destination is required'});
        }

        if(validator.isEmpty(shipmentInput.origin)){
            errors.push({ message: 'Shipping Origin is required'});
        }

        if(validator.isEmpty(shipmentInput.total)){
            errors.push({ message: 'Shipping Total is required'});
        }

        if(validator.isEmpty(shipmentInput.status)){
            errors.push({ message: 'Shipping Status is required'});
        }

        if(errors.length > 0){
            const error:any = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const _shipId = random_shipmentId_generator(6);

        const user = await User.findById(req.userId);
        if(!user){
            const error:any = new Error('Invalid user');
            error.code = 401;
            throw error;
        }

        const cargoList = shipmentInput.cargo.length > 0 ? shipmentInput.cargo.map((result:any) =>(
                                {...result}
                            )) : shipmentInput.cargo;
        const servicesList = shipmentInput.services.length > 0 ? shipmentInput.services.map((service:any) =>(
                                    {...service}
                              )): shipmentInput.services;

        const _shipment = new Shipment({
                id:_shipId,
                name: shipmentInput.name,
                cargo: cargoList,
                mode: shipmentInput.mode,
                type: shipmentInput.type,
                destination: shipmentInput.destination,
                origin: shipmentInput.origin,
                services:servicesList,
                total: shipmentInput.total,
                status: shipmentInput.status,
                postedBy:   user
        });

        const createdShipment = await _shipment.save();
        user.shipmentId.push(createdShipment);

        return  {
                    ...createdShipment._doc, 
                    _id: createdShipment._id.toString(), 
                    createdAt: createdShipment.createdAt.toISOString,
                    updatedAt: createdShipment.updatedAt.toISOString,
                }
    },



    shipments: async function({page,perPage}:any,req:any){
        if(!req.isAuthenticated){
            const error:any = new Error('not isAuthenticated');
            error.code = 401;
            throw error;
        }
        if(!page){
            page = 1;
        }

        if(!perPage){
            perPage = 20;
        }
        const totalShipments = await Shipment.find().countDocuments();
        const shipments       = await Shipment.find()
                                              .sort({createdAt: -1})
                                              .skip((page - 1) * perPage)
                                              .limit(perPage)
                                              .populate('postedBy')


        return {
            shipments: shipments.map(shipment => {
                      return {
                          ...shipment._doc, _id: shipment._id.toString(), 
                          createdAt: shipment.createdAt.toISOString(),
                          updatedAt: shipment.updatedAt.toISOString()
                      }
            }), totalShipments: totalShipments
        }

    },

    user: async function(args:any,req:any){
        console.log(req.isAuthenticated,'--');
        if(!req.isAuthenticated){
            const error:any = new Error('Not Authenticated');
            error.code = 401;
            throw error;
        }
        const user = await User.findById(req.userId); 
        if(!user){
            const error:any = new Error('No User found');
            error.code =  401;
            throw error;
        }
        return {...user._doc, _id: user._id.toString()}

    },

    // fetch single shipment
    shipment: async function(args:any,req:any){
        if(!req.isAuthenticated){
            const error:any = new Error('Not Authenticated');
            error.code = 401;
            throw error;
        }
       
        const shipment  = await Shipment.findOne({id:args.id});
        console.log(shipment)
        if(!shipment){
            const error:any = new Error('No shipment found');
            error.code =  401;
            throw error;
        }
                                              

        return {
            ...shipment._doc, _id: shipment._id.toString(), 
            createdAt: shipment.createdAt.toISOString(),
            updatedAt: shipment.updatedAt.toISOString()
            }
        },

    deleteShipment: async function(args:any,req:any){
            if(!req.isAuthenticated){
                const error:any = new Error('Not Authenticated');
                error.code = 401;
                throw error;
            }
        
            const shipment  = await Shipment.findById(args.id);
            if(!shipment){
                const error:any = new Error('No shipment found');
                error.code =  401;
                throw error;
            }

            if(shipment.postedBy.toString() !== req.userId.toString()){
                const error:any = new Error('Not Authenticated');
                error.code =  401;
                throw error;
            } 
            
            // try{
                await Shipment.findByIdAndRemove(args.id);
                const user = await User.findById(req.userId);
                user.shipmentId.pull(args.id);
                await user.save();

                return true

            // }catch(err){
            //     console.log(err,'')
            //     if(err){
                    
            //         return false
            //     }
            // }
            
        },


    updateShipment: async function({id,shipmentInput}:any, req:any){
        if(!req.isAuthenticated){
            const error:any = new Error('user not authenticated');
            error.code = 401;
            throw error;
        }

        const shipmentData = await Shipment.findById(id).populate('postedBy');
        if(!shipmentData){
            const error:any = new Error('No shipment found');
            error.code = 401;
            throw error;
        }
        if(shipmentData.postedBy._id.toString() !== req.userId.toString()){
            const error:any = new Error('Not Authorized');
            error.code =  403;
            throw error;
        } 

        const errors = [];
        
        if(validator.isEmpty(shipmentInput.name)){
            errors.push({ message: 'Name is required'});
        }

        if(validator.isEmpty(shipmentInput.mode)){
            errors.push({ message: 'Shipping Mode is required'});
        }

        if(validator.isEmpty(shipmentInput.type)){
            errors.push({ message: 'Shipping Type is required'});
        }

        if(validator.isEmpty(shipmentInput.destination)){
            errors.push({ message: 'Shipping Destination is required'});
        }

        if(validator.isEmpty(shipmentInput.origin)){
            errors.push({ message: 'Shipping Origin is required'});
        }

        if(validator.isEmpty(shipmentInput.total)){
            errors.push({ message: 'Shipping Total is required'});
        }

        if(validator.isEmpty(shipmentInput.status)){
            errors.push({ message: 'Shipping Status is required'});
        }

        if(errors.length > 0){
            const error:any = new Error('Invalid input');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const cargoList = shipmentInput.cargo.length > 0 ? shipmentInput.cargo.map((result:any) =>(
                                {...result}
                            )) : shipmentInput.cargo;
        const servicesList = shipmentInput.services.length > 0 ? shipmentInput.services.map((service:any) =>(
                                    {...service}
                              )): shipmentInput.services;
        
        
        shipmentData.name = shipmentInput.name;
        shipmentData.cargo = cargoList;
        shipmentData.mode = shipmentInput.mode;
        shipmentData.type = shipmentInput.type;
        shipmentData.destination = shipmentInput.destination;
        shipmentData.origin = shipmentInput.origin;
        shipmentData.services = servicesList;
        shipmentData.total = shipmentInput.total;
        shipmentData.status = shipmentInput.status;

        const updatedShipment = await shipmentData.save();

        return  {
                    ...updatedShipment._doc, 
                    _id: updatedShipment._id.toString(), 
                    createdAt: updatedShipment.createdAt.toISOString,
                    updatedAt: updatedShipment.updatedAt.toISOString,
                }
    },



}