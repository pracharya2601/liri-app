
//add dotenv package for hiding private api keys
require("dotenv").config();
const keys = require("./keys.js");

//spotify npm package
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

//files system npm pakage
const fs = require("fs");
//package for making requests
const axios = require("axios");
//format date npm pakage
const moment = require("moment");

//declare command and search that will be used
let command = (process.argv[2]);

let search = process.argv.slice(3).join(" ");

var content = fs.readFileSync("./result.txt", "utf8")

//liri funciton

function liri() {
 //command spotify-this-song
   if (command === "spotify-this-song") {
       //if user put a track, liri will search this track
       if (search) {
           spotify.search({ type: 'track', query: search, limit: 1 }, function (err, data) {
               if (err) {
                   //return console.log('Error occurred: ' + err);
               }

            //collect data in an array
            let spotifyArr = data.tracks.items;
            for (i = 0; i<spotifyArr.length; i++) {
                console.log(`\n--------------- \nArtist:  ${spotifyArr[i].artists[0].name} \nThe Song's name: ${spotifyArr[i].name} \nLink: ${spotifyArr[i].external_urls.spotify} \nAlbum: ${spotifyArr[i].album.name} \n\n--------------- `)
            }
               if (!content.includes(spotifyArr[0].name)) {
                   fs.appendFile('./result.txt', "\n" + "\n" + command + ", " + search + "\n" + "--------------- " + "\n" + "Artist: " +
                   spotifyArr[0].artists[0].name + "\n" + "Song name: " + spotifyArr[0].name +
                       "\n" + "Preview on Spotify: " + spotifyArr[0].uri + "\n" + "Album: " + spotifyArr[0].album.name +
                       "\n" + "--------------- ", "utf8", function (err) { })
               }

           });

       } else {
           //if user didn't put a track, liri will give default information
           spotify.search({ type: 'track', query: "All the Small Things", limit: 1 }, function (err, data) {
               if (err) {
                   return console.log('Error occurred: ' + err);
               }
               console.log(data);

           });
       }

   } else if (command === "concert-this") {
       if (search) {
           //command concert-this will give information about venues of artist that we entered
           axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp").then((response) => {
               if (response.data.length == 0) {
                   console.log("Your artist go on tour SOON");
               } else {
                   fs.appendFile('./result.txt', "\n" + "\n" + command + ", " + search, "utf8", function (err){});

                   let eventArr = response.data;
                   for (var i = 0; i < eventArr.length; i++) {

                    console.log(`\n--------------- \nVenue:  ${eventArr[i].venue.name} \nLocation: ${eventArr[i].venue.city} ${eventArr[i].venue.region}
                     \nDate: ${moment(eventArr[i].datetime).format("MM/DD/YYYY")} \n\n--------------- `)

                        if (!content.includes(eventArr[i].venue.name)) {
                           fs.appendFile('./result.txt', "\n" + "--------------- " + "\n" + "Venue: " + eventArr[i].venue.name +
                               "\n" + "Location: " + eventArr[i].venue.city + ", " + eventArr[i].venue.region +
                               "\n" + "Date: " + moment(eventArr[i].datetime).format("MM/DD/YYYY") +
                               "\n" + "--------------- ", "utf8", function (err) { })
                       }
                   }
               }
           }).catch((err) => {
               if (err) {
                   console.log(err.message);
               }
           })

       } else {
           console.log("write name of artist");
       }
   } else if (command === "movie-this") {
       //command movie-this will give information about movie that user needs
       if (search) {
           axios.get("https://www.omdbapi.com/?t=" + search + "&plot=short&apikey=trilogy").then((response) => {
               console.log("--------------- ");
               console.log("Title: " + response.data.Title);
               console.log("Year: " + response.data.Year);
               console.log("IMDB Rating: " + response.data.imdbRating);
                if (response.data.Ratings.length >= 2) {
                   console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
               }
               console.log("Country: " + response.data.Country);
               console.log("Language: " + response.data.Language);
               console.log("Plot: " + response.data.Plot);
               console.log("Actors: " + response.data.Actors);
               console.log("--------------- ");

           })

       } else {
           //if user didn't put any movie, by default liri will give information about "Titanic" movie
           axios.get("https://www.omdbapi.com/?t=Titanic&y=&plot=short&apikey=trilogy").then((response) => {
               console.log("--------------- ");
               console.log("Title: " + response.data.Title);
               console.log("Year: " + response.data.Year);
               console.log("IMDB Rating: " + response.data.imdbRating);
               if (response.data.Ratings[1].Value) {
                   console.log("Rotten Tomatoes: " + response.data.Ratings[1].Value);
               }
               console.log("Country: " + response.data.Country);
               console.log("Language: " + response.data.Language);
               console.log("Plot: " + response.data.Plot);
               console.log("Actors: " + response.data.Actors);
               console.log("--------------- ");

           })
       }
       //command do-what-it-says will give user default command and search
   } else if (command === "do-what-it-says") {
       var contents = fs.readFileSync('./random.txt', 'utf8');
       command = contents.slice(0, contents.indexOf(","));
       search = contents.slice(contents.indexOf(",") + 2);
       liri();
       //if user put command that wasn't recognized by liri, user will get this message
   } else {
       console.log("--------------- ");
       console.log("Sorry,command is not recognized. Please try: 'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'")
       console.log("--------------- ")
   }
}



liri();
