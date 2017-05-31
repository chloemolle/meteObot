var express = require('express');
var router = express.Router();
var weatherService = require('../server/weatherService');
var parser = require('json-parser');
var weatherData = require('../server/model/weatherData');

/* GET hello world page. */
router.get('/', function(req, res, next) {
	weatherService.getGeolocalisation("paris").then(function(data){
		var parsedData = parser.parse(data);
		var coords = parsedData.results[0].geometry.location;
		console.log(coords);
		weatherService.getWeatherForecast(coords.lat, coords.lng).then(function(data){
			var parsedWeather = parser.parse(data);
			var temps = parsedWeather.list[0].temp;
			var min = Number(temps.min)-273.15;
			var max = Number(temps.max)-273.15;

			weatherData.WeatherData(data);
			console.log(weatherData.forecast[0].weather.image);

			res.send("title " + weatherData.forecast[0].display_date + " " + 
	            "image_url " + weatherData.forecast[0].weather.image + " " + 
	            "subtitle" + "min: " + min.toFixed(0) + " and max: " + max.toFixed(0));
		});
	});
});

module.exports = router;
