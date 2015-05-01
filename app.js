var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var redis = require('redis');
var redisClient;

//Need to do a check to see if we're in prod and need to auth to REDIS DB
//Only the prod environment has the REDISTOGO_URL environment variable set.
//This was set when we installed RedisTogo to our Heroku instance.
if (process.env.REDISTOGO_URL) {
	var rtg = require('url').parse(process.env.REDISTOGO_URL);
	var redisClient = redis.createClient(rtg.port, rtg.hostname);
	redisClient.auth(rtg.auth.split(":")[1]);
} else {
	redisClient = redis.createClient();
}
 

var redisInstance = (process.env.NODE_ENV) ? process.env.NODE_ENV.length : 'development'.length;

redisClient.select(redisInstance);

app.use(express.static('public'));

app.get('/cities', function(request, response) {
	redisClient.hkeys('cities', function(error, cityNames) {
		if (error) {
			console.log('error getting cities from redis');
		} else {
			console.log('Number of cities: ' + cityNames.length);
			response.json(cityNames);
		}
	})
});

app.post('/cities', parseUrlencoded, function(request, response) {
	var newCity = request.body;

	redisClient.hset('cities', newCity.name, newCity.description, function(error) {
		if (error) {
			console.log('Error saving city');
		} else {
			console.log('successfully saved city: ' + newCity.name);
			response.status(201).json(newCity.name);
		}
	});

});

module.exports = app;
