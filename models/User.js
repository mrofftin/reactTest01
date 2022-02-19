const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')


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

// 미들웨어 함수는 요청 오브젝트(req), 응답 오브젝트 (res), 
// 그리고 애플리케이션의 요청-응답 주기 중 그 다음의 미들웨어 함수 대한 액세스 권한을 갖는 함수입니다. 
// 그 다음의 미들웨어 함수는 일반적으로 next라는 이름의 변수로 표시됩니다.

// 미들웨어 함수는 다음과 같은 태스크를 수행할 수 있습니다.

// 모든 코드를 실행.
// 요청 및 응답 오브젝트에 대한 변경을 실행.
// 요청-응답 주기를 종료.
// 스택 내의 그 다음 미들웨어를 호출.


// 저장하기 전에 function을 한다.
userSchema.pre('save', function(next){
    var user = this // this는 userSchema를 의미한다. 따라서, user는 userSchema

    // 비밀번호를 바꿀때만 암호화 하기 위해 조건을 달아준다.
    // email 변경시에는 동작하지 않도록 하기 위함
    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)

            //user.password는 평문, hash는 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next() // 비밀번호가 아닌 경우에는 index.js의 save로 넘어간다.
    }
})

userSchema.methods.comparePassword = function(plainPassword, callback){
    //plainPassword와 암호화된 비밀번호가 서로 같은지 확인하기
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return callback(err)
        callback(null, isMatch)
    })
}

userSchema.methods.generateToken = function(callback) {

    var user = this

    // jsonwebtoken을 이용해서 token을 생성하기
    // _id는 데이터베이스의 필드
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // token 생성원리
    // 두개를 합쳐서 token을 만들고
    // user._id + 'secretToken' = token
    // 'secretToken'을 넣으면 user._id가 나온다.

    user.token = token
    user.save(function(err, user){
        if(err) return callback(err)
        callback(null, user)
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User } // User 모델을 다른곳에서 쓸수 있도록 export 시켜준다.