import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const  CargoSchema = new Schema({
    type: String,
    description: String,
    volume: String
});

const  ServiceSchema = new Schema({
    type: String,
    value: String
});

const shipmentSchema = new Schema({
    id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    cargo:[CargoSchema],
    mode:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    destination:{
        type: String,
        required: true
    },
    origin:{
        type: String,
        required: true
    },
    services: [ServiceSchema],
    total:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    postedBy:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
},
{timestamps: true}
)

export default mongoose.model('Shipment', shipmentSchema);