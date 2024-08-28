const mongoose = require('mongoose');


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

    
})


const User = mongoose.model('user', userSchema);

module.exports = User;