/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var request = require('request');

var getGitHubProfile = function(user) {
  var options = {
    url: 'https://api.github.com/users/' + user,
    headers: { 'User-Agent': 'request' },
    json: true // will JSON.parse(body) for us
  };

  return new Promise(function(resolve, reject) {
    request.get(options, function(err, data, body) {
      if (err) { return reject(err); }

      var simpleProfile = {
        id: body.id,
        login: body.login,
        name: body.name,
        company: body.company,
        location: body.location
      };
      resolve(simpleProfile);
    });
  });
};

var fetchProfileAndWriteToFile = function(readFilePath, writeFilePath) {
  return fs.readFileAsync(readFilePath)
    .then(function (fileData) {
      var username = fileData.toString().slice(0, fileData.toString().indexOf('\n'));
      return getGitHubProfile(username);
    })
    .then(function (userProfile) {
      return fs.writeFileAsync(writeFilePath, JSON.stringify(userProfile));
    });
};

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
