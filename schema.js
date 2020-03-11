exports.typeDefs = `
type Recipe {
    name:  String!
    category: String!
    description: String!
    instructions: String!
    createdDate: String
    likes: Int
    username: String
}

type User {
    username: String! @unique
    password: String!
    email: String!
    joinDate: String
    favorites: [Recipe] 
}
`;

/*must provide type definition, this is what graphQL names its schema, make sure those types match with mongoose models, cú pháp sẽ thay đổi 1 tẹo. "!" means required, @unique means unique

favorites là [Recipe] vì trong file User.js reference của nó là recipe model
*/
