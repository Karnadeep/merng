const User = require('../../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../../config')
const { validateRegisterInput, validateLoginInput } = require('../../util/validators')
const { UserInputError } = require('apollo-server')

function generateToken(user) {

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, {
        expiresIn: '1h'
    })
    return token
}
module.exports = {
    Mutation: {
        async login(_, {
            username, password
        }) {
            const { errors, valid } = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            const user = await User.findOne({ username })
            if (!user) {
                errors.general = "User  not found"
                throw new UserInputError("User not found", { errors })
            }
            const match = await bcryptjs.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong credentials"
                throw new UserInputError("Wrong credentials", { errors });
            }
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_,
            { registerInput: { username, email, password, confirmPassword } }
            , context, info) {
            // TODO validate the user data
            const { errors, valid } = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            // Make sure that the user doesnt already exist
            const user = await User.findOne({ username })
            if (user) {
                throw new UserInputError('Username is taken',
                    {
                        errors: {
                            username: 'Username is already taken'
                        }
                    })
            }
            // hash password and return token
            password = await bcryptjs.hash(password, 12)
            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            });
            const res = await newUser.save();
            const token = generateToken(res)
            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}