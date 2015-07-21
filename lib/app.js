var express = require('express')
var bodyParser = require('body-parser')
var process = require('child_process')
var ps = require('ps-node')

var app = express()
// var FB = require('./facebook/facebook')
// var db = require('./database/mysql')
// db

var threads = {}

var allProcess = function () {
  ps.lookup({
    command: 'node',
    arguments: '--child'
  }, function (err, resultList) {
    if (err) {
      throw new Error(err)
    }

    resultList.forEach(function (process) {
      if (process) {
        console.log('PID: %s', process.pid)
      }
    })
  })
}

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/all', function (req, res) {
  console.log('[Process list]')
  allProcess()
  res.json({
    result: 'success'
  })
})

app.post('/queue', function (req, res) {
  console.log('Post Queue is called!')
  var tmp = process.fork('./lib/server.js', ['--child'])
  console.log(tmp.pid)
  tmp.send({
    message: 'Test Thread',
    pageId: req.body.pageId
  })
  threads[tmp.pid] = tmp
  res.json(req.body)
})

app.get('/kill/:pid', function (req, res) {
  if (threads[req.params.pid]) {
    threads[req.params.pid].disconnect()
  }
  delete threads[req.params.pid]
  console.log('[Process list]')
  allProcess()
  res.json({
    result: 'success'
  })
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('[App listening at http://%s:%s]', host, port)
})
