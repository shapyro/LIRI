require("dotenv").config();
var Spotify = require("spotify");
var Twitter = require("twitter");

var keys = require("./keys.js");

var song = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

switch (command) {
  case "my-tweets":
    getTwitter();
    break;
  case "spotify-this-song":
    // console.log("spotify")
    getSpotify();
    break;
  case "movie-this":
    console.log("movie")
    break;
  case "do-what-it-says":
    console.log("doing things")
    break;
  default:
    console.log("not an option");
}

function getTwitter(){
  var params = {screen_name: 'shapyro1'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      // console.log(tweets);
      for (var item of tweets) {
        console.log(item.created_at);
        console.log(item.text);
      }
    } else {
      console.log(error);
    }
  });
}

function getSpotify(){
  console.log("spotify");
  song.request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
  .then(function(data) {
    console.log(data); 
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });
}