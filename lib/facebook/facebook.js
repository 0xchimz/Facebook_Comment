var request = require('request')
var q = require('q')

var user = {
  accessToken: null,
  pageId: null
}

module.exports = {
  init: function (data) {
    console.log('Start Facebook process ...')
    user.accessToken = data.accessToken
    user.pageId = data.pageId
  },
  getPost: function () {
    var deferred = q.defer()
    var fields = 'feed.limit(100){updated_time,story,message,status_type},id'
    var urlGetPost = graphUrl() + user.pageId + '/?fields=' + fields + '&access_token=' + user.accessToken

    request(urlGetPost, function (error, response, body) {
      console.log('Starting ...')
      var result = JSON.parse(body)
      if (result.error === undefined) {
        deferred.resolve(result.feed.data)
      } else {
        deferred.reject(result)
      }
    })
    return deferred.promise
  }
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
