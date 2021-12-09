import { buildSchema } from "graphql";

export default buildSchema(`
    type Cargo {
        type:String
        description: String
        volume:String
    }

    type Service {
        type: String
        value:String
    }

    type Shipment{
        _id:ID!
        id: String!
        name: String!
        cargo: [Cargo]
        mode: String!
        type: String
        destination: String!
        origin: String!
        services: [Service]
        total: String!
        status: String!
        createdAt: String
        updatedAt: String
        postedBy: String
        
    }

  

    type User{
        _id:ID!
        userId:String!
        name: String!
        email: String!
        shipments: [Shipment!]!
    }

   
    input CargoInputData {
        type:String
        description: String
        volume:String
    }
    input ServiceInputData {
        type: String
        value:String
    }

    input ShipmentInputData{
        name: String!
        cargo: [CargoInputData]
        mode: String!
        type: String
        destination: String!
        origin: String!
        total: String!
        status: String!
        services: [ServiceInputData]
    }

   

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }


    type ShipmentData {
        shipments: [Shipment!]!
        totalShipments: Int!
    }

    type AuthData{
        token: String!
        userId: String!
    }


    type RootQuery{
        login(email:String!, password:String!): AuthData
        shipments(page: Int!,perPage: Int!): ShipmentData
        user: User!
        shipment(id: String!): Shipment!


    }

    type RootMutation{
        createUser(userInput: UserInputData): User!
        createShipment(shipmentInput: ShipmentInputData!): Shipment!
        updateShipment(id: ID!,shipmentInput: ShipmentInputData!): Shipment!
        deleteShipment(id: ID!): Boolean 

        
    }

    schema {
         query: RootQuery
         mutation: RootMutation
     }


`);