const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
    const { username, email } = user;
    //create that token
    return jwt.sign({username, email}, secret, { expiresIn })
}

exports.resolvers = {
    Query: {
        getAllRecipes: async (root, args, { Recipe }) => {
            const allRecipes = await Recipe.find().sort({ createdDate: 'desc' });
            return allRecipes;
        },
        /* all the logic for executing this query, query này là lấy cả đống data về, chứ ko phải là recipe cụ thể nào cả => args 

        Query là để query data, Mutation: to do something with those data
        */
       getRecipe: async (root, {_id}, {Recipe}) => {
            const recipe = await Recipe.findOne({ _id });
            return recipe;
       },

       getCurrentUser: async (root, args, { currentUser, User }) => { //currentUser là đc destructure từ context ở graphqlExpress, User means User model
            if(!currentUser) {
                return null
            }

            const user = await User.findOne({ username: currentUser.username })
                .populate({
                    path: 'favorites',
                    model: 'Recipe'
                }); //trong User model có 1 cái field là favorites ref là Recipe. When we call populate() it will inject the entire Recipe model, were gonna get an array of recipes, not just the ids.
            
            return user; //Next: create withSession.js
       }

    },

    //When we want to change database    
    Mutation: {
        addRecipe: async (root, { name, description, category, instructions, username }, { Recipe }) => {
            const newRecipe = await new Recipe({
                name,
                description,
                category,
                instructions,
                username
            }).save();
            
            return newRecipe;
        },

        signinUser: async (root, {username, password}, {User}) => {
            const user = await User.findOne({username});
            if (!user) {
                throw new Error('User not found');
            }

            //compare password user type in with the password in database
            const isValidPassword = await bcrypt.compare(password, user.password); 
            if (!isValidPassword) {
                throw new Error('Invalid password')
            }
            //nếu password đúng thì nhả token lần nữa
            return { token: createToken(user, process.env.SECRET, '1hr')}
        },

        signupUser: async (root, {username, email, password}, { User }) => {
            const user = await User.findOne({ username: username });
            if (user) {
                throw new Error('User already exists'); //nếu tìm thấy user đó trong database thì báo lỗi vì đã tồn tại rồi
                
            }
            const newUser = await new User({
                username,
                email,
                password
            }).save(); //create a new user and save it to database
            return { token: createToken(newUser, process.env.SECRET, '1hr')}
            //vào variables.env, define 1 cái SECRET bất kỳ, random string, exprires in 1 hour
        }
    }

    /*addRecipe here takes in 3 args, root (or parent), tiếp theo là args (có thể destructure) đc, chính là mấy cái đã pass vào ở schema), cuối cùng là context argument, chính là Recipe model. Xong ở trên Browser sẽ có thêm 1 cái query là Mutation

    TEST
        mutation {
        addRecipe(name: "Takoyaki", category: "Japanse food", description: "Really good", instructions:"grill") {
            name
            category
            instructions
            description
            }
        }

    RESULTS trên graphiql
            {
                "data": {
            "addRecipe": {
            "name": "Takoyaki",
            "category": "Japanse food",
            "instructions": "grill",
            "description": "Really good"
            }
        }
        }

        đoạn {} ở sau fn đáng lẽ ra là return cả cái model Recipe, nhưng mà thực tế thì chỉ có thể return những thông tin mình cần => nhét những field mình muốn vào đó         
    */
};