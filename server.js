//main file for BE 
const express = require('express');
//mongoose is a package that connect our BE to mlab and creating SCHEMA. cái string ở trong require chính là tên package
const mongoose = require('mongoose');
const bodyParser = require('body-parser');//use for JSON responses
const cors = require('cors'); //a package that allow cross domain request from React to BE
const jwt = require('jsonwebtoken');
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

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true //needed for apollo client to work correctly
}

app.use(cors(corsOptions));


//Set up JWT authentication middleware
app.use(async (req, res, next) => {
    //get token from request.headers.authorization
    const token = req.headers['authorization'];
    if(token !== "null") { //khi nào có token thì mới tiến hành authenticate, vì khi clear Storage rồi login lại thì token bằng null 
        try {
            const currentUser = await jwt.verify(token, process.env.SECRET); //phải pass lên cả secret nữa
            console.log(currentUser);
            req.currentUser = currentUser; //add currentUser info to the request object, xong thì pass xuống graphqlExpress
        } catch(err) {
            console.log(err)
        }
    }
     //console log này là ở terminal chứ ko phải browser
    next(); //call next function in the middleware chain
});

//another middleware fn, means adding the mongoose model to graphQL, connect schema with graphQL

//Lúc này là có thể vào localhost:4444 đc rồi, pass bodyParser vào đây như là middleware, chủ yếu là làm việc với json data nên thêm json()
app.use('/graphql', bodyParser.json(), graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
        Recipe,
        User,
        currentUser //sau đó thì qua schema để tạo new Query getCurrentUser
    }
})));

//Create GraphiQL application
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

//set up server
const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`server listening on PORT${PORT}`)
})