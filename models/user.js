const mongoose = require('mongoose');
const { timeStamp } = require('node:console');
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

}, { timestamps: true })




userSchema.pre('save', function (next) {
    const user = this;                   // this means current user
    
    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString();       // salt is a user secret key 
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();

})



userSchema.static('matchPassword', async function(email, password){
    const user = await this.findOne({ email });
    if(!user) throw new Error('User not found');
    

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvideHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    if(hashedPassword !== userProvideHash) throw new Error('Incorrect password');

    return user;

})



const User = mongoose.model('user', userSchema);

module.exports = User;

