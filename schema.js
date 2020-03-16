exports.typeDefs = `
type Recipe {
    _id: ID
    name:  String!
    imageUrl: String!
    category: String!
    description: String!
    instructions: String!
    createdDate: String
    likes: Int
    username: String
}

type User {
    _id: ID
    username: String! @unique
    password: String!
    email: String!
    joinDate: String
    favorites: [Recipe] 
}

type Query {
    getAllRecipes: [Recipe]
    getRecipe(_id: ID!): Recipe
    searchRecipes(searchTerm: String): [Recipe]
    getCurrentUser: User
    getUserRecipes(username: String!): [Recipe]
}

type Token {
    token: String!
}

type Mutation {
    addRecipe(name: String!, imageUrl: String!, description: String!, category: String!, instructions: String!, username: String): Recipe

    deleteUserRecipe(_id: ID!): Recipe

    likeRecipe(_id: ID!, username: String!): Recipe

    unlikeRecipe(_id: ID!, username: String!): Recipe

    updateUserRecipe(_id: ID!, name: String!, imageUrl: String!, description: String!, category: String!): Recipe

    signupUser(username: String!, email: String!, password: String!): Token

    signinUser(username: String!, password: String!): Token 
}
`;

/*must provide type definition, this is what graphQL names its schema, make sure those types match with mongoose models, cú pháp sẽ thay đổi 1 tẹo. "!" means required, @unique means unique

getAllRecipes: [Recipe] A fn that returns a list of recipes

addRecipe(all the args (fields) need for the Recipe to be created)

favorites là [Recipe] vì trong file User.js reference của nó là recipe model
*/
