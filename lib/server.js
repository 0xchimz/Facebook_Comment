var FB = require('./facebook/facebook')
var mysql = require('./database/mysql')
var q = require('q')
var moment = require('moment')

process.on('message', function (msg) {
  FB.init(msg)
  FB.getPost()
    .then(function (res) {
      console.log('Compare post ... ')
      q.all(storeAllPost(res, msg)).then(function (res) {
        console.log(res)
        mysql.disconnect()
        killProcess()
      }, errorHandler)
    }, errorHandler)
})

process.on('disconnect', function (e) {
  killProcess()
})

process.on('error', function (e) {
  console.log(process.pid + ' Error ')
})

var errorHandler = function (error) {
  console.log('======ERROR=======')
  console.log(error)
  console.log('==================')
  killProcess()
}

var killProcess = function () {
  console.log('Kill process [' + process.pid + '] ...\n')
  process.kill(process.pid)
}

var convertDate = function (date) {
  var dateDB = new Date(date)
  var strDate = dateDB.getFullYear() + '-' +
    (dateDB.getMonth() + 1) + '-' +
    dateDB.getDate() + ' ' +
    dateDB.getHours() + ':' +
    dateDB.getMinutes() + ':' +
    dateDB.getSeconds()
  return moment(strDate, 'YYYY-MM-DD H:m:s').format()
}

var storeAllPost = function (list, data) {
  var tmp = []
  list.forEach(function (item) {
    var deferred = q.defer()
    mysql.getPost(item.id, function (error, rows) {
      if (!error) {
        var _dateFB = moment(item.updated_time, 'YYYY-MM-DD H:m:s').format()
        if (rows.length !== 0) {
          var _dateDBconvert = convertDate(rows[0].updated_time)
          if (_dateFB !== _dateDBconvert) {
            mysql.update({
              postId: item.id,
              updatedTime: _dateFB,
              read: 0
            }, function (error, response) {
              if (!error) {
                deferred.resolve({update: item.id})
              } else {
                deferred.reject(error)
              }
            })
          } else {
            deferred.resolve({notupdate: item.id})
          }
        } else {
          mysql.storePost({
            postId: item.id,
            updatedTime: _dateFB
          }, function (error, response) {
            if (!error) {
              deferred.resolve({insert: item.id})
            } else {
              deferred.reject(error)
            }
          })
        }
      } else {
        deferred.reject(error)
      }
    })
    tmp.push(deferred.promise)
  })
  return tmp
}
