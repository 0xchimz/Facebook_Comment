process.on('message', function (msg) {
  console.log(msg.pageId)
})

process.on('disconnect', function (e) {
  process.kill(process.pid)
})

process.on('error', function (e) {
  console.log(process.pid + ' Error ')
})
