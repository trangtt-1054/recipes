const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//use Schema variable to create Schema as a constructor
const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    username: {
        type: String
    }
})

RecipeSchema.index({
    '$**': 'text' //search for a value on every field within the recipe
})

module.exports = mongoose.model('Recipe', RecipeSchema); 
//(name of the schema, schema variable)