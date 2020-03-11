//main file for BE 
const express = require('express');
//mongoose is a package that connect our BE to mlab and creating SCHEMA. cái string ở trong require chính là tên package
const mongoose = require('mongoose');


const bodyParser = require('body-parser');//use for JSON responses

require('dotenv').config({ path: 'variables.env' });
const Recipe = require('./models/Recipe');
const User = require('./models/User');

//bringin graphQL-Express Middleware
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express'); //add graphQL middleware, connect graphQL with Express
const { makeExecutableSchema } = require('graphql-tools');


const { typeDefs } = require('./schema'); //need its own schema for type checking
const { resolvers } = require('./resolvers');

//Create schema
const schema = makeExecutableSchema({
    typeDefs, //typeDefs : typeDefs
    resolvers
});

// connect to database 
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));

//initialize application
const app = express();

//Create GraphiQL application
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

//another middleware fn, means adding the mongoose model to graphQL, connect schema with graphQL
app.use('./graphql', graphqlExpress({
    schema,
    context: {
        Recipe,
        User
    }
}));


//set up server
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`server listening on PORT${PORT}`)
})