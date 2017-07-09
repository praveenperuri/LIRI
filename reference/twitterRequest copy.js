// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var keys = require("./keys.js");
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: keys.twitterApiKeys.ConsumerKey,
  consumer_secret: keys.twitterApiKeys.ConsumerSecret,
  access_token_key: keys.twitterApiKeys.AccessToken,
  access_token_secret: keys.twitterApiKeys.AccessTokenSecret
});

console.log(keys);

var params = {q: 'node.js', result_type: 'recent', count: 20 };
client.get('search/tweets', params, function(error, tweets, response) {

	  // If the request was successful...
  if (!error && response.statusCode === 200) {
  	var result = tweets;
    // Then log the body from the site!
    //console.log(tweets);
    console.log('********************* Number of tweets = ' + tweets.statuses.length + '*********************************');
    // console.log(JSON.stringify(tweets));
    // var jsonResponse = JSON.parse(tweets);
    for(i=0;i<=tweets.statuses.length;i++){
    	console.log('Tweet # ' + i + ' : ' + tweets.statuses[i].text);
    	console.log('Favorite Count : ' + tweets.statuses[i].favorite_count);
    }
  }
});



// var keys = require("./keys.js");
// var request = require("request");

// // OAuth1.0 - 3-legged server side flow (Twitter example) 
// // step 1 
// var qs = require('querystring')
//    , oauth = {
//     consumer_key: keys.twitterApiKeys.ConsumerKey, //callback: 'http://mysite.com/callback/', 
//     consumer_secret: keys.twitterApiKeys.ConsumerSecret
// }

// , url = 'https://api.twitter.com/oauth/request_token';

// request.post({ url: url, oauth: oauth }, function(e, r, body) {
//     // Ideally, you would take the body in the response 
//     // and construct a URL that a user clicks on (like a sign in button). 
//     // The verifier is only available in the response after a user has 
//     // verified with twitter that they are authorizing your app. 

//     // step 2 
//     var req_data = qs.parse(body);
//     var uri = 'https://api.twitter.com/oauth/authenticate' + '?' + qs.stringify({ oauth_token: req_data.oauth_token });
//         // redirect the user to the authorize uri 
//     console.log(qs);
//     // step 3 
//     // after the user is redirected back to your server 
//     var auth_data = qs.parse(body),
//         oauth = {
//             consumer_key: keys.twitterApiKeys.ConsumerKey,
//             consumer_secret: keys.twitterApiKeys.ConsumerSecret,
//             token: auth_data.oauth_token,
//             token_secret: req_data.oauth_token_secret,
//             verifier: auth_data.oauth_verifier
//         },
//         url = 'https://api.twitter.com/oauth/access_token';

//     console.log(qs);

//     request.post({ url: url, oauth: oauth }, function(e, r, body) {
//         // ready to make signed requests on behalf of the user 
// if(e)
// {
// 	console.log(e);
// }

//         console.log(body);

//         var perm_data = qs.parse(body),
//            oauth = {
//                 consumer_key: keys.twitterApiKeys.ConsumerKey,
//                 consumer_secret: keys.twitterApiKeys.ConsumerSecret,
//                 token: perm_data.oauth_token,
//                 token_secret: perm_data.oauth_token_secret
//             },
//             url = 'https://api.twitter.com/1.1/search/tweets.json',
//             qs = {
//                 q: 'fifa',
//                 result_type: 'recent',
//                 count: 15,
//                 lang : 'en'
//             };
//         request.get({ url: url, oauth: oauth, qs: qs, json: true }, function(e, r, tweets) {
//             if (!e && r.statusCode === 200) {
//                 console.log(tweets);
//             }

//             if(e) {
//             	console.log(e);
//             }

//         })
//     })
// })
