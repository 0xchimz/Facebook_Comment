var request = require('request')
var q = require('q')

var config = {
  appId: '1612859535650264',
  appSecret: 'db109519527158400fabc4753b124a26'
}

var user = {
  accessToken: null,
  pageId: null
}

module.exports = {
  init: function (data) {
    console.log('Start Facebook process ...')
    user.accessToken = data.accessToken
    user.pageId = data.pageId
    getPost().then(function (res) {
      console.log('Result from Facebook ...')
      console.log(res)
    })
  },
  getPost: getPost
}

var getPost = function () {
  console.log('Starting ...')
  var fields = 'feed.limit(100){updated_time,story,message,status_type},id'
  var urlGetPost = graphUrl() + user.pageId + '/?fields=' + fields + '&access_token=' + user.accessToken
  // request(urlGetPost, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     var postList = JSON.parse(body)
  //   }
  // })
  console.log(urlGetPost)
  var deferred = q.defer()
  request(urlGetPost, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      deferred.resolve(JSON.parse(body))
    } else {
      deferred.reject(JSON.parse(error))
    }
  })
  return deferred.promise
}

var graphUrl = function (version) {
  var url = 'https://graph.facebook.com/'
  if (version) {
    url += 'v' + version + '/'
  // url += 'oauth/access_token'
  // url += '?client_id=' + config.appId
  // url += '&client_secret=' + config.appSecret
  // url += '&grant_type=client_credentials'
  } else {
    url += 'v2.4/'
  }
  return url
}
