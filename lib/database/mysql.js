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
  storePost: function (data) {
    insert({
      post_id: data.postId,
      updated_time: data.updated_time,
      page_id: data.pageId,
      read: 0
    })
  }
}

var insert = function (commentList) {
  connection.query('INSERT INTO fbComment SET ?', commentList, function (err, res) {
    console.log('INSERT TO DB')
    console.log(err)
    console.log(res)
  })
}

var getAllPost = function (pageId, callback) {
  var strQuery = "SELECT * FROM fbpagepost WHERE post_id = '" + pageId + "'"
  connection.query(strQuery, callback)
}
