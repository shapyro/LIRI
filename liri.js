require("dotenv").config();
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
// var moment = require("moment");
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = "";
var songName = "";
var movieName = "";

//  condition for command from user input vs do-what-it-says
if (process.argv[2]) {
  command = process.argv[2];
}

listen();

function listen(){
  //  execute command
  switch (command) {
    case "my-tweets":
        getTwitter();
        break;
    case "spotify-this-song":
        getSpotify();
        break;
    case "movie-this":
        getMovie();
        break;
    case "do-what-it-says":
        whatItDo();
        break;
    default:
      console.log("NOT AN OPTION")
      console.log("Options are: \n\"my-tweets\" \n\"spotify-this-song\" \n\"movie-this\" \n\"do-what-it-says\"");
  }
}

//  get Twitter data
function getTwitter(){
  var params = {screen_name: 'shapyro1'};
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      for (var item of tweets) {
        console.log("-------------");
        console.log(item.created_at);
        console.log('"' + item.text + '"');
      }
    } else {
      console.log(error);
    }
  });
}

//  getSpotify data
function getSpotify(){

  if (!process.argv[3] && !songName){
    songName = "Ace of Base";
    spotifySearch();
  } else if (songName !== "") {
    spotifySearch();
  } else {
    for (var i = 3; i < process.argv.length; i++){
      songName += " " + process.argv[i];
    }
    spotifySearch();
  }

  function spotifySearch(){
    spotify.search({ type: 'track', query: songName.trim() }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } 
    
      var info = data.tracks.items;
      var item = info[0];
      console.log("********************");
      console.log("song = " + item.name);
      console.log("ALBUM = " + item.album.name);
      var artists = item.album.artists;
      for (artist of artists) {
        console.log("artist = " + artist.name);
      }
      console.log("url = " + item.external_urls.spotify)
    });
  }
}

//  get Movie data
function getMovie(){

  if (!process.argv[3] && movieName === ""){
    movieName = "Mr. Nobody";
  } else{
    for (var i = 3; i < process.argv.length; i++){
      movieName += " " + process.argv[i];
    }
    // console.log(movieName.trim());
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName.trim() + "&apikey=trilogy";

  request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {
        console.log("********************");
        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log(JSON.parse(body).Ratings[0].Source +": " + JSON.parse(body).Ratings[0].Value);
        console.log(JSON.parse(body).Ratings[1].Source +": " + JSON.parse(body).Ratings[1].Value);
        console.log("Country: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
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
    // console.log(data.toString());
    var dataArray = data.split(",");
    // console.log(dataArray);
    command = dataArray[0];
    // console.log("Here is the command " + command);
    songName = dataArray[1];
    // console.log(songName)
    listen();
  });
}