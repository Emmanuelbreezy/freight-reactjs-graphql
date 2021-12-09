import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    
    shipmentId:[{
        type: Schema.Types.ObjectId,
        ref:'Shipment'
    }]
   
}
)

export default mongoose.model('User', userSchema);