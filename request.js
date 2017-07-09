// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");
var keys = require("./keys.js");
var inquirer = require("inquirer");
var Twitter = require('twitter');
var geocoder = require("geocoder");
var weather = require("weather-js");

//Prompt User
inquirer.prompt([
    // {
    //     type: "input",
    //     name: "name",
    //     message: "Who are you???"
    // }, 
    {
        type: "list",
        name: "requestWhat",
        message: "What is your request??",
        choices: ["Search for a movie?", "Search in Twitter?", "Search in Spotify?", "Get geocode of a location?", "Get weather at a location?"]
    }
]).then(function(user) {
    switch (user.requestWhat) {
        case "Search in Spotify?":
            inputSpotifyRequest();
            break;
        case "Search for a movie?":
            inputMovieRequest();
            break;
        case "Search in Twitter?":
            inputTwitterRequest();
            break;
        case "Get geocode of a location?":
        	getGeocodeRequest();
        	break;
        case "Get weather at a location?":
        	getWeatherRequest();
        	break;
        default:
            console.log("BAD REQUEST");
            break;
    }
});


function inputSpotifyRequest() {
    inquirer.prompt([{
        type: "list",
        name: "spotifyReq",
        message: "What are you searching for in Spotify?",
        choices: ["Artist?", "Track?", "Album?", "Playlist?"]

    }]).then(function(user) {
        switch (user.spotifyReq) {
            case "Artist?":
                getSpotifySearchTerm("artist");
                break;
            case "Track?":
                getSpotifySearchTerm("track");
                break;
            case "Album?":
                getSpotifySearchTerm("album");
                break;
            case "Playlist?":
                getSpotifySearchTerm("playlist");
                break;
            default:
                console.log("BAD REQUEST");
                break;
        }
    });
}

function getSpotifySearchTerm(type) {
    var msg = "Type name of the " + type + "?";
    inquirer.prompt([{
        type: "input",
        name: "searchTerm",
        message: msg
    }]).then(function(user) {
        if (user.searchTerm !== null || user.searchTerm !== undefined) {
            var args = user.searchTerm.split(' ');
            var searchString = "";
            if (args.length > 1) {
                for (i = 0; i < args.length; i++) {
                    searchString = searchString + args[i] + "+";
                }
                searchString = searchString.slice(0, -1);
            } else {
                searchString = args[0];
            }
            console.log(searchString);
            getSpotifyResults(type, searchString);
        }
    });
}








function getSpotifyResults(type, input) {
    //make api call and log results	
    var client_id = keys.spotifyApiKeys.ClientID; // Your client id
    var client_secret = keys.spotifyApiKeys.ClientSecret; // Your secret

    // your application requests authorization
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    console.log(authOptions);

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            // use the access token to access the Spotify Web API
            var urL = 'https://api.spotify.com/v1/search?q=' + input + '&type=' + type + '&market=US&limit=10';
            var token = body.access_token;
            var options = {
                url: urL,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    //console.log(body.artists.items[0]);
                }
            });
        }
    });

}


function inputMovieRequest() {
    inquirer.prompt([{
        type: "input",
        name: "movieReq",
        message: "Type name of the movie?"
    }]).then(function(user) {
        if (user.movieReq !== null || user.movieReq !== undefined) {
            getMovieResults(user.movieReq);
        }
    });

}

function getMovieResults(input) {
    //make api call and log results	
    //omdbrequest
    var args = input.split(' ');
    var movieName = "";

    if (args.length > 1) {

        for (i = 0; i < args.length; i++) {
            movieName = movieName + args[i] + "+";
        }
        movieName = movieName.slice(0, -1);
    } else {
        movieName = args[0];
    }

    console.log(movieName);

    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            console.log(JSON.parse(body));
            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
        }
    });
}

function inputTwitterRequest() {
    inquirer.prompt([{
        type: "input",
        name: "twitterReq",
        message: "Type search term for twitter?"
    }]).then(function(user) {

        if (user.twitterReq !== null || user.twitterReq !== undefined) {
            var searchString = user.twitterReq;
            console.log(searchString);
            getTwitterResults(searchString);
        }

    });

}

function getTwitterResults(input) {

    var client = new Twitter({
        consumer_key: keys.twitterApiKeys.ConsumerKey,
        consumer_secret: keys.twitterApiKeys.ConsumerSecret,
        access_token_key: keys.twitterApiKeys.AccessToken,
        access_token_secret: keys.twitterApiKeys.AccessTokenSecret
    });

    console.log(input);

    var params = { q: input, result_type: 'recent', count: 10 };
    client.get('search/tweets', params, function(error, tweets, response) {
        // If the request was successful...
        if (!error && response.statusCode === 200) {
            var result = tweets;
            // Then log the body from the site!
            //console.log(tweets);
            for (i = 0; i < tweets.statuses.length; i++) {
                console.log('Tweet: ' + tweets.statuses[i].text);
                console.log('Favorite Count: ' + tweets.statuses[i].favorite_count);
            }
            console.log('***************************** Number of tweets = ' + tweets.statuses.length + '*********************************');
        }
    });

}



function getGeocodeRequest() {

	inquirer.prompt([

  {
    type: "input",
    name: "userInput",
    message: "Which location or landmark would you like to geocode?"
  }

// After the prompt, store the user's response in a variable called location.
]).then(function(location) {

  // console.log(location.userInput);

  // Then use the Google Geocoder to Geocode the address
  geocoder.geocode(location.userInput, function(err, data) {

    console.log(JSON.stringify(data, null, 2));
  });

});

}



function getWeatherRequest() {

  inquirer.prompt([
  {
    type: "input",
    name: "userInput",
    message: "Type location or landmark to get current weather?"
  }
]).then(function(location) {

	if(location.userInput !== undefined && location.userInput !== null) {

		weather.find({ search: location.userInput, degreeType: "F" }, function(err, result) {

		  if (err) {
		    console.log(err);
		  }
		  console.log(JSON.stringify(result, null, 4));

		});
	} else {
		console.log('Please make a valid entry !!')
	}

});


}




















// //omdbrequest
// var args = process.argv;
// var movieName = "";

// if(args.length > 3) {

// for (i=2;i<args.length;i++){
// 	movieName = movieName + args[i] + "+"; 
// }

// movieName = movieName.slice(0,-1);	

// } else {
// 	movieName = args[2];
// }

// console.log(movieName);

// // Then run a request to the OMDB API with the movie specified
// request("http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {

//   // If the request is successful (i.e. if the response status code is 200)
//   if (!error && response.statusCode === 200) {

//   	console.log(JSON.parse(body));
// 	    // Parse the body of the site and recover just the imdbRating
//     // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//     console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
//   }
// });

// Twitter
// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
// var keys = require("./keys.js");
// var Twitter = require('twitter');

// var client = new Twitter({
//   consumer_key: keys.twitterApiKeys.ConsumerKey,
//   consumer_secret: keys.twitterApiKeys.ConsumerSecret,
//   access_token_key: keys.twitterApiKeys.AccessToken,
//   access_token_secret: keys.twitterApiKeys.AccessTokenSecret
// });

// console.log(keys);

// var params = {q: 'node.js', result_type: 'recent', count: 20 };
// client.get('search/tweets', params, function(error, tweets, response) {

// 	  // If the request was successful...
//   if (!error && response.statusCode === 200) {
//   	var result = tweets;
//     // Then log the body from the site!
//     //console.log(tweets);
//     console.log('********************* Number of tweets = ' + tweets.statuses.length + '*********************************');
//     // console.log(JSON.stringify(tweets));
//     // var jsonResponse = JSON.parse(tweets);
//     for(i=0;i<=tweets.statuses.length;i++){
//     	console.log('Tweet # ' + i + ' : ' + tweets.statuses[i].text);
//     	console.log('Favorite Count : ' + tweets.statuses[i].favorite_count);
//     }
//   }
// });


// //Spotify

// var keys = require("./keys.js");
// var request = require('request'); // "Request" library



// var client_id = keys.spotifyApiKeys.ClientID; // Your client id
// var client_secret = keys.spotifyApiKeys.ClientSecret; // Your secret

// // your application requests authorization
// var authOptions = {
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//     },
//     form: {
//         grant_type: 'client_credentials'
//     },
//     json: true
// };

// request.post(authOptions, function(error, response, body) {
//     if (!error && response.statusCode === 200) {

//         // use the access token to access the Spotify Web API
//         var token = body.access_token;
//         var options = {
//             url: 'https://api.spotify.com/v1/search?q=tiesto&type=artist&market=US&limit=15',
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             },
//             json: true
//         };
//         request.get(options, function(error, response, body) {
//             if (!error && response.statusCode === 200) {
//                 console.log(body);
//                 console.log(body.artists.items[0]);
//             }
//         });
//     }
// });
