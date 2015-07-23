var mysql = require('mysql')
var q = require('q')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Sellsuki'
})

connection.connect(function (error) {
  if (!error) {
    console.log('[db] Database is connected ...')
  } else {
    console.log('[db] Error while connecting database ...')
  }
})

module.exports = {
  storePost: function (data, callback) {
    insert({
      post_id: data.postId,
      updated_time: data.updatedTime,
      isread: (data.read || 0)
    }, callback)
  },
  getAllPost: function (pageId) {
    return getAllPost(pageId)
  },
  getPost: function (postId, callback) {
    return getPost(postId, callback)
  },
  update: function (data, callback) {
    return update({
      post_id: data.postId,
      updated_time: data.updatedTime
    }, callback)
  },
  disconnect: function () {
    console.log('[db] Disconnect from DB ...')
    connection.end()
  }
}

var insert = function (commentList, callback) {
  connection.query('INSERT INTO fbpagepost SET ?', commentList, function (error, response) {
    console.log('INSERT TO DB')
    callback(error, response)
  })
}

var update = function (data, callback) {
  var strQuery = "UPDATE fbpagepost SET updated_time = '" + data.updated_time + "', isread = 0 WHERE post_id = '" + data.post_id + "'"
  connection.query(strQuery, function (error, response) {
    callback(error, response)
  })
}

var getPost = function (postId, callback) {
  var strQuery = "SELECT * FROM fbpagepost WHERE post_id = '" + postId + "'"
  connection.query(strQuery, function (error, rows) {
    callback(error, rows)
  })
}

var getAllPost = function (pageId) {
  var deferred = q.defer()
  var strQuery = "SELECT * FROM fbpagepost WHERE post_id LIKE '%" + pageId + "%' ORDER BY updated_time DESC LIMIT 100"
  connection.query(strQuery, function (error, rows) {
    if (!error) {
      deferred.resolve(rows)
    } else {
      deferred.reject(error)
    }
  })
  return deferred.promise
}
