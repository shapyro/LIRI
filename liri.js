require("dotenv").config();
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

switch (command) {
  case "my-tweets":
    getTwitter();
    break;
  case "spotify-this-song":
    getSpotify();
    break;
  case "movie-this":
    console.log("movie")
    getMovie();
    break;
  case "do-what-it-says":
    whatItDo();
    break;
  default:
    console.log("not an option");
}

function getTwitter(){
  var params = {screen_name: 'shapyro1'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
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

  var songName = "";

  if (!process.argv[3]){
    songName = "The Sign";
  } else{
    for (var i = 3; i < process.argv.length; i++){
      songName += " " + process.argv[i];
    }
    // console.log(songName.trim());
  }

  spotify.search({ type: 'track', query: songName }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    } 
   
  var info = data.tracks.items;
  console.log("********************");
  // console.log(info[1]);
  // console.log(info[1].external_urls.spotify);
   
  for (item of info){
    console.log("------------------");
    console.log("song = " + item.name);
    // console.log(item);
    console.log("ALBUM = " + item.album.name);
    
    var artists = item.album.artists;
    for (artist of artists) {
      console.log("artist =  " + artist.name);
    }
    console.log("url = " + item.external_urls.spotify)
  }

  });

  // extra track search if more info may be needed using trackID
  // spotify.request('https://api.spotify.com/v1/tracks/6PGoSes0D9eUDeeAafB2As')
  // .then(function(data) {
  //   console.log("HERE IS THE TRACK INFO:")
  //   console.log(data); 
  // })
  // .catch(function(err) {
  //   console.error('Error occurred: ' + err); 
  // });
}

function getMovie(){
  var movieName = "";

  if (!process.argv[3]){
    movieName = "Mr. Nobody";
  } else{
    for (var i = 3; i < process.argv.length; i++){
      movieName += " " + process.argv[i];
    }
    console.log(movieName.trim());
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName.trim() + "&apikey=trilogy";

  request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {
    console.log(JSON.parse(body));
    console.log(JSON.parse(body).Title);
    console.log(JSON.parse(body).Year);
    console.log(JSON.parse(body).Ratings[0]);
    console.log(JSON.parse(body).Ratings[1]);
    console.log(JSON.parse(body).Country);
    console.log(JSON.parse(body).Language);
    console.log(JSON.parse(body).Plot);
    console.log(JSON.parse(body).Actors);
    // console.log("The movie's rating is: " + JSON.parse(body).year);
  } else {
    console.log("Error occured: " + error);
  }
});
}

//  Read from random.txt for botomation
function whatItDo(){
  fs.readFile("random.txt", "utf8", function(error, data){
    if (error){
      return console.log(error);
    }
    var dataArray = data.split(",");
    // var total = 0;
    console.log(dataArray);
    for (key of dataArray){
      console.log(key);
      if (key === "spotify-this-song"){
        console.log("GOOD"+key);
      }
      console.log(key[0]);
    }
    console.log("something happend");
  })
}