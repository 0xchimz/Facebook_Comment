var request = require('request')

var config = {
  appId: '1612859535650264',
  appSecret: 'db109519527158400fabc4753b124a26'
}

var user = {
  accessToken: null
}

module.exports = {
  init: function () {
    console.log('Facebook initialization!')
  },

  setAccessToken: function (accessToken) {
    user.accessToken = accessToken
  }
}

var graphUrl = function (option, version) {
  var url = 'https://graph.facebook.com/'
  if (version) {
    url += 'v' + version + '/'
    url += 'oauth/access_token'
    url += '?client_id=' + config.appId
    url += '&client_secret=' + config.appSecret
    url += '&grant_type=client_credentials'
  } else {
    url += 'v2.4/'
    url += 'sss'
  }
  return url
}
