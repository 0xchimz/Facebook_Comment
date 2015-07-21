var FB = require('./facebook/facebook')

process.on('message', function (msg) {
  // console.log(msg.pageId)
  FB.init(msg)
})

process.on('disconnect', function (e) {
  process.kill(process.pid)
})

process.on('error', function (e) {
  console.log(process.pid + ' Error ')
})
