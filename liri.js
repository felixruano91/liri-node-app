// require all npm packages
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var request = require('request');
var fs = require('fs');
var moment = require('moment');

var getArtistName = function(artist) {
  return artist.name;
};

var getThisSong = function (songName) {
  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    };
    var songs = data.tracks.items;
    for (var i = 0; i < songs.length; i++) {
      console.log(i);
      console.log('artist(s): ' + songs[i].artists.map(getArtistName));
      console.log('song name: ' + songs[i].name);
      console.log('preview song: ' + songs[i].preview_url);
      console.log('album: ' + songs[i].album.name);
      console.log('--------------------------------------------------------');
    }
  });
};

var getThisMovie = function(movieName) {
  request("https://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonData = JSON.parse(body);
      console.log('Title: ' + jsonData.Title);
      console.log('Year: ' + jsonData.Year);
      console.log('Rotten Tomatoes Rating: ' + jsonData.Ratings[1].Value);
      console.log('IMDB Rating: ' + jsonData.imdbRating);
      console.log('Country: ' + jsonData.Country);
      console.log('Language: ' + jsonData.Language);
      console.log('Plot: ' + jsonData.Plot);
      console.log('Actors: ' + jsonData.Actors);
      console.log('---------------------------------------------------------');
    }
  });
};

var doWhatItSays = function () {
  fs.readFile('random.txt', 'utf8', function (err, data) {
    if (err) throw err;
    var dataArr = data.split(',');
    if( dataArr.length == 2) {
      statements(dataArr[0], dataArr[1]);
    } else if (dartaArr.length == 1) {
      statements(dataArr[0]);
    }
  });
}

var concertThis = function (concertName) {
  request("https://rest.bandsintown.com/artists/" + concertName + "/events?app_id=codingbootcamp", function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var jsonData = JSON.parse(body);
      for (var i = 0; i < jsonData.length; i++) {
        var venue = jsonData[i].venue.name;
        var country = jsonData[i].venue.country;
        var city = jsonData[i].venue.city;
        console.log('Venue: ' + venue);
        console.log('Location: ' + city + ', ' + country);
        console.log('Date: ' + moment(jsonData[i].datetime).format('L'));
        console.log('--------------------------------------------------')
      }
    } else if (err) {
      console.log('error: ' + err);
    }
  });
};

var statements = function(caseData, functionData) {
  switch(caseData) {
    case 'concert-this':
      concertThis(functionData);
      break;
    case 'spotify-this-song':
      getThisSong(functionData);
      break;
    case 'movie-this':
      getThisMovie(functionData);
      break;
    case 'do-what-it-says':
      doWhatItSays();
      break;
    default:
    console.log('LIRI does not know that!');
  };
};

var runThis = function(argOne, argTwo) {
  statements(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);