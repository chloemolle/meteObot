var express = require('express');
var router = express.Router();
var weatherService = require('../server/weatherService');
var parser = require('json-parser');

/* GET hello world page. */
router.get('/', function(req, res, next) {
	weatherService.getGeolocalisation("Brest").then(function(data){
		var parsedData = parser.parse(data);
		var coords = parsedData.results[0].geometry.location;
		console.log(coords);
		weatherService.getWeatherForecast(coords.lat, coords.lng).then(function(data){
			res.send(data);
			//res.send("lat: " + coords.lat + " and long: " + coords.lng);
		});
	});
});

module.exports = router;
