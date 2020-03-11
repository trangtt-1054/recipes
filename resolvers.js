exports.resolvers = {
    Query: {
        getAllRecipes: async (root, args, { Recipe }) => {
            const allRecipes = await Recipe.find();
            return allRecipes;
        }
        /* all the logic for executing this query, query này là lấy cả đống data về, chứ ko phải là recipe cụ thể nào cả => args 

        Query là để query data, Mutation: to do something with those data
        */

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