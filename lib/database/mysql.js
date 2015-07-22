var mysql = require('mysql')

var connection = mysql.createconnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Sellsuki'
})

connection.connect(function (error) {
  if (!error) {
    console.log('[db] Database is connected ...\n\n')
  } else {
    console.log('[db] Error while connecting database ...\n\n')
  }
})

var insert = function (commentList, callback) {
  connection.query('INSERT INTO fbComment SET ?', commentList, callback)
}

var getAllPost = function (pageId, callback) {
  var strQuery = "SELECT * FROM fbpagepost WHERE post_id = '" + pageId + "'"
  connection.query(strQuery, callback)
}
