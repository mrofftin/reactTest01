const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const config = require('./config/key');
const { user, User } = require("./models/User") // User 모델 가져오기



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

const mongoose = require('mongoose')
// mongoose.connect('mongodb+srv://jhkim:test1234@cluster0.p5jqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('MongoDB errors', err))

app.get('/', (req, res) => {
  res.send('Hello World!~~ 하이!! 안녕하세요!!')
})

// 회원 가입을 위한 라우터
app.post('/register', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// mongodb+srv://jhkim:test1234@cluster0.p5jqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority