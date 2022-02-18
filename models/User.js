const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength: 50
    },
    email: {
        type:String,
        trim: true, // jh kim --> jhkim // 공백을 없애줌
        unique: 1 // email은 중복 허용 안됨
    },
    password:{
        type: String,
        minlength: 4
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type:Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = { User } // User 모델을 다른곳에서 쓸수 있도록 export 시켜준다.