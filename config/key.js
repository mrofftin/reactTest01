if(process.env.NODE_ENV === 'production') { // 배포시
    module.exports = require('./prod')
} else {
    module.exports = require('./dev') // 개발환경
}
