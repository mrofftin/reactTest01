const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key');
const { auth } = require('./middleware/auth')
const { User } = require("./models/User") // User 모델 가져오기

// BodyParser
// HTTPpost put 요청시 request body에 들어오는 데이터값을 읽을 수 있는 구문으로 
// 파싱함과 동시에 req.body 로 입력해주어 응답 과정에서 요청에 body 프로퍼티를 
// 새로이 쓸 수 있게 해주는 미들웨어

// bodyParser는 클라이언트에서 오는 정보를 서버에서
// 분석해서 가져올 수 있게 해주는 미들웨어

// app.use() 안에 있는 함수들이 미들웨어이다.

//application/x-www-form-urlencoded 형식의 데이터를 분석해서 가져오도록 해줌
app.use(bodyParser.urlencoded({extended: true}))

// application/json 형식의 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json())
app.use(cookieParser())

const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://jhkim:test1234@cluster0.p5jqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('MongoDB errors', err))

app.get('/', (req, res) => {
  res.send('Hello World!~~ 하이!! 안녕하세요!!')
})

// 회원 가입을 위한 라우터
app.post('/api/users/register', (req, res) => {
  // 회원가입시 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err}) // 에러가 있는 경우 클라이언트에게 알려준다
    return res.status(200).json({ // 성공했을 경우
      success: true
    })
  })
})

app.post('/api/users/login', (req, res) => {
  // 요청한 이메일을 데이터베이스에 있는지 찾기
  User.findOne({email:req.body.email} , (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청한 이메일이 데이터베이스에 있으면 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) 
        return res.json({loginSuccess: false, message:"비밀번호가 맞지않습니다." }) 

    // 비밀번호가 일치하면 토큰을 생성
    user.generateToken((err, user)=>{
      if(err) return res.status(400).send(err)

      // 토큰을 저장한다. 어디에 ? 쿠키, 로컬스토리지 > 저장위치는 여러곳이 있다.
      res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId:user._id})

      })
    })
  })
})

// callback function을 받기전에
// 중간에서 해주는 역할의 기능들 middleware라고 한다.
// auth 인자는 미들웨어 
app.get('/api/users/auth',auth, (req, res) =>{
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 의미
  // role 1 : 어드민, role 2 : 특정 부서 어드민 정하기 나름
  // 현재는 role 0 :일반 유저, role 0이 아니면 관리자
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role:req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req,res) => {
  
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""},
    (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// mongodb+srv://jhkim:test1234@cluster0.p5jqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority