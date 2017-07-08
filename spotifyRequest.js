
// var keys = require("./keys.js");
// var SpotifyWebApi = require('spotify-web-api-node');

// var client_id = keys.spotifyApiKeys.ClientID; // Your client id
// var client_secret = keys.spotifyApiKeys.ClientSecret; // Your secret
// var access_token = 0;

// // credentials are optional
// var spotifyApi = new SpotifyWebApi({
//   clientId : client_id,
//   clientSecret : client_secret//,
//   //redirectUri : 'http://www.example.com/callback'
// });


// // Retrieve an access token.
// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);
//     access_token = data.body['access_token'];
//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);

//     console.log('hello access token is: ' + access_token);

// // // Search tracks whose name, album or artist contains 'Love'
// // spotifyApi.searchTracks('Love')
// //   .then(function(data) {
// //     console.log('Search by "Love"', data.body);
// //   }, function(err) {
// //     console.error(err);
// //   });

// // // Search artists whose name contains 'Love'
// // spotifyApi.searchArtists('Love')
// //   .then(function(data) {
// //     console.log('Search artists by "Love"', data.body);
// //   }, function(err) {
// //     console.error(err);
// //   });

// // // Search tracks whose artist's name contains 'Love'
// // spotifyApi.searchTracks('artist:Love')
// //   .then(function(data) {
// //     console.log('Search tracks by "Love" in the artist name', data.body);
// //   }, function(err) {
// //     console.log('Something went wrong!', err);
// //   });

// // Search tracks whose artist's name contains 'Kendrick Lamar', and track name contains 'Alright'
// spotifyApi.searchTracks('track:bad artist:michael jackson')
//   .then(function(data) {
//     console.log('Search tracks by "Alright" in the track name and "Kendrick Lamar" in the artist name', data.body);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });

// // // Search playlists whose name or description contains 'workout'
// // spotifyApi.searchPlaylists('workout')
// //   .then(function(data) {
// //     console.log('Found playlists are', data.body);
// //   }, function(err) {
// //     console.log('Something went wrong!', err);
// //   });

//   }, function(err) {
//         console.log('Something went wrong when retrieving an access token', err);
//   });







/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

var keys = require("./keys.js");
var request = require('request'); // "Request" library



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

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
            url: 'https://api.spotify.com/v1/search?q=tiesto&type=artist&market=US&limit=15',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            json: true
        };
        request.get(options, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(body);
                console.log(body.artists.items[0]);
            }
        });
    }
});
