var FB = require('./facebook/facebook')

process.on('message', function (msg) {
  FB.init(msg)
// console.log(FB.getPost())
})

process.on('disconnect', function (e) {
  process.kill(process.pid)
})

process.on('error', function (e) {
  console.log(process.pid + ' Error ')
})
