const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('node:crypto');


const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
    
})


userSchema.pre('save', function(next) {
    const user = this;                   // this means current user

    if(!user.isModified('password')) return;

    const salt = randomBytes(16).toString();       // salt is a user secret key 
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
    
})


const User = mongoose.model('user', userSchema);

module.exports = User;