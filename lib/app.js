var express = require('express')
var bodyParser = require('body-parser')
var process = require('child_process')
var ps = require('ps-node')

var app = express()

var threads = {}

var allProcess = function (callback) {
  ps.lookup({
    command: 'node',
    arguments: '--child'
  }, function (err, resultList) {
    if (err) {
      throw new Error(err)
    }
    callback(resultList)
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
  allProcess(function (result) {
    res.json(result)
  })
})

app.post('/queue', function (req, res) {
  console.info('\nAdd new job!')
  var tmp = process.fork('./lib/server.js', ['--child'])
  console.info('Process id ' + tmp.pid + ' is started')
  if (req.body.accessToken && req.body.pageId) {
    tmp.send({
      message: 'Test Thread',
      pageId: req.body.pageId,
      accessToken: req.body.accessToken
    })
    threads[tmp.pid] = tmp
    res.json({
      result: 'success'
    })
  } else {
    res.json({
      result: 'error',
      message: 'invalid accessToken, pageId'
    })
  }
})

app.get('/kill/:pid', function (req, res) {
  if (threads[req.params.pid]) {
    threads[req.params.pid].disconnect()
  }
  delete threads[req.params.pid]
  console.log('[Process list]')
  allProcess(function (result) {
    res.json(result)
  })
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('[App listening at http://%s:%s]', host, port)
})
