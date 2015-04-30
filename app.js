var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

var cities = {
	'Lotopia': 'cool place',
	'Caspiana': 'nice beaches',
	'Indigo': 'bluish'
}

app.use(express.static('public'));

app.get('/', function(request, response) {
	response.send('OK');
});

app.get('/cities', function(request, response) {
	//var citiesList = [];
	//for (var key in cities) {
	//	citiesList.push(key);
	//}
	response.json(Object.keys(cities));
});

app.post('/cities', parseUrlencoded, function(request, response) {
	var newCity = request.body;
	cities[newCity.name] = newCity.description;
	response.status(201).json(newCity.name);
});

module.exports = app;
