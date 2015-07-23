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
    console.log('[db] Database is connected ...\n')
  } else {
    console.log('[db] Error while connecting database ...\n')
  }
})

module.exports = {
  storePost: function (data, callback) {
    insert({
      post_id: data.postId,
      updated_time: data.updatedTime,
      page_id: data.pageId,
      read: 0
    }, callback)
  }
}

var insert = function (commentList, callback) {
  connection.query('INSERT INTO fbpagepost SET ?', commentList, function (error, response) {
    console.log('INSERT TO DB')
    callback(error, response)
  })
}

var getAllPost = function (pageId, callback) {
  var strQuery = "SELECT * FROM fbpagepost WHERE post_id = '" + pageId + "'"
  connection.query(strQuery, callback)
}
