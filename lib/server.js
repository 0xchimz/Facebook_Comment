var FB = require('./facebook/facebook')
var mysql = require('./database/mysql')

process.on('message', function (msg) {
  FB.init(msg)
  FB.getPost()
    .then(function (res) {
      console.log('Result from Facebook ...')
      console.log(res)
    }, function (error) {
      console.log('Error to get post from Facebook ...')
      console.error(error)
    })
})

process.on('disconnect', function (e) {
  process.kill(process.pid)
})

process.on('error', function (e) {
  console.log(process.pid + ' Error ')
})
