var FB = require('./facebook/facebook')
var mysql = require('./database/mysql')
var q = require('q')

process.on('message', function (msg) {
  FB.init(msg)
  FB.getPost()
    .then(function (res) {
      console.log('Result from Facebook ...')
      q.all(storeAllPost(res, msg)).then(function () {
        console.log('Save all post to database')
        console.log('All job is finished!')
        killProcess()
      }, function (error) {
        console.log('Error to save post in database ...')
        console.error(error)
        killProcess()
      })
    }, function (error) {
      console.log('Error to get post from Facebook ...')
      console.error(error)
      killProcess()
    })
})

process.on('disconnect', function (e) {
  killProcess()
})

process.on('error', function (e) {
  console.log(process.pid + ' Error ')
})

var killProcess = function () {
  console.log('Kill process [' + process.pid + '] ...')
  process.kill(process.pid)
}
var storeAllPost = function (list, data) {
  var tmp = []
  list.forEach(function (item) {
    var deferred = q.defer()
    mysql.storePost({
      postId: item.id,
      updatedTime: item.updated_time,
      pageId: data.pageId
    }, function (error, response) {
      if (!error) {
        deferred.resolve(response)
      } else {
        deferred.reject(error)
      }
    })
    tmp.push(deferred.promise)
  })
  return tmp
}
