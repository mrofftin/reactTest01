const express = require('express')
const app = express()
const port = 3000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jhkim:test1234@cluster0.p5jqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('MongoDB errors', err))

app.get('/', (req, res) => {
  res.send('Hello World!~~ 하이!! 사이트 방문을 환영합니다...')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// mongodb+srv://jhkim:test1234@cluster0.p5jqm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority