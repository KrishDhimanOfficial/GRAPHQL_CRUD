import fastify from "fastify"
import dotenv from 'dotenv'
import mercurius from 'mercurius'
import resolvers from './resolvers/user.resolver.js'
import mongoose from "mongoose"
import cors from "@fastify/cors"
dotenv.config()

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error.message))


const app = fastify({})

app.register(cors, {
    origin: '*'
})


const schema = `#graphql
    type User {
        _id: ID
        name: String,
        email: String,
        password: String
    }

   type DeleteResult {
  success: Boolean!
  deletedId: ID
  message: String
}

    type Query {
        users: [User]
    }

    type Mutation {
    createUser(name: String!, email: String!, password: String!): User,
    updateUser(id: ID!, name: String!, age: Int!): User
    deleteUser(id: ID!,): DeleteResult,
    getUser(id: ID!): User
  }
`;

app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true // Enable GraphiQL UI at /graphiql
})

app.listen({ port: process.env.PORT }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`🚀 Server running at http://localhost:${process.env.PORT}/graphiql`)
})