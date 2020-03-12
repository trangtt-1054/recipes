const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt'); //a package to ecrypt the password before saving to database

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    favorites: {
        type: [Schema.Types.ObjectId], //1 array of type objectid, referencing 'recipe' model
        ref: 'Recipe'
    }
})

UserSchema.pre('save', function(next) { //"pre" method means before any user save to database, run a function
    if(!this.isModified('password')) { //if the password field is not modified
        return next(); //jump to the next middleware fn
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        })
    }) //sau khi xong hàm này, thử tạo 1 user mới sẽ thấy password đc mã hoá hầm bà lằng 
})

/* */

module.exports = mongoose.model('User', UserSchema);