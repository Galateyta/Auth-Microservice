const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


const User = mongoose.model('user', new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {   
        type: Boolean, 
        default: false 
    },
    token: {
        type: String
    },
    confirmToken: {
        type: String,
    }
}));

module.exports = User;
