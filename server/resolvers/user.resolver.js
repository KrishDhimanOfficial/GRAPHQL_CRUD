import userModel from "../models/user.model.js"

const resolvers = {
    Mutation: {
        createUser: async (_, { name, email, password }) => {
            const response = await userModel.create({ name, email, password })
            return response
        },
        updateUser: async (_, { id, name, email, password }) => {
            const response = await userModel.updateOne({ _id: id }, { $set: { name, email, password } })
            return response
        },
        getUser: async (_, { id }) => {
            return await userModel.findById(id)
        },
        deleteUser: async (_, { id }) => {
            const response = await userModel.deleteOne({ _id: id })
            console.log(response);
            
            return response
        },
    },
    Query: {
        users: async () => await userModel.find(),
    },
}

export default resolvers