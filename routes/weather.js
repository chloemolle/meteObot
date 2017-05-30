var express = require('express');
var router = express.Router();
var weatherService = require('../server/weatherService');

/* GET hello world page. */
router.get('/', function(req, res, next) {
	weatherService.getGeolocalisation("Brest").then(function(data){
		res.send(data);
	});
});

module.exports = router;
