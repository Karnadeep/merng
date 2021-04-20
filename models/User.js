const { model, Schema } = require('mongoose')

userSchema = new Schema({
    username: String,
    email: String,
    password: String,
    createdAt: String
});

module.exports = model('User', userSchema);