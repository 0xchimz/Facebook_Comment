var gulp = require('gulp')
var spawn = require('child_process').spawn
var node

gulp.task('node', function (callback) {
  if (node) {
    console.log('Kill previous node!')
    node.kill(node.pid)
  }
  node = spawn('node', ['lib/app.js'], { stdio: 'inherit' })
  node.on('close', function (code) {
    if (code === 8) {
      console.log('Error detected, waiting for changes...')
    }
  })
})

gulp.task('watch', function () {
  gulp.watch('./lib/**/*.js', ['node'])
})

gulp.task('default', ['node', 'watch'])

process.on('exit', function () {
  if (node) {
    console.log('Kill previous node!')
    node.kill()
  }
})
