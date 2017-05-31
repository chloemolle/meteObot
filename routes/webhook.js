var express = require('express');
var router = express.Router();
var chatService = require('../server/chatService');
var userService = require('../server/userService');
var weatherService = require('../server/weatherService');
var parser = require('json-parser');

/* GET hello world page. */
router.get('/', function(req, res, next) {
	if(chatService.authenticate(req)){
  		res.status(200).send(req.query['hub.challenge']);
	}else{
		res.sendStatus(403);
	}
});

router.post('/', function (req, res) {

  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {

        console.log("Before if event message");
        if (event.message) {
           console.log("After if event message");
          if(!userService.isUserKnown(event.sender.id)){
            console.log("User unknown, sending welcome message")
            userService.addUser(event.sender.id, event.sender);
            chatService.sendTextMessage(event.sender.id, "Hello, you newcomer, please enter a city name");
          }else{
            console.log("User is known");
            receivedMessage(event);
          }
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  // Putting a stub for now, we'll expand it in the following steps
  console.log("Message data: ", event.message);
  //chatService.sendTextMessage(event.sender.id, "HUEHUEHUE");
  weatherService.getGeolocalisation(event.message.text).then(function(data){
    var parsedData = parser.parse(data);
    if(parsedData.results[0]){
      var coords = parsedData.results[0].geometry.location;
      console.log(coords);
      weatherService.getWeatherForecast(coords.lat, coords.lng).then(function(data){
        var parsedWeather = parser.parse(data);
        var temps = parsedWeather.list[0].temp;
        var min = Number(temps.min)-273.15;
        var max = Number(temps.max)-273.15;
        chatService.sendTextMessage(event.sender.id, "min: " + min.toFixed(0) + " and max: " + min.toFixed(0));
        //chatService.sendTextMessage(event.sender.id, "received");
      });
      //chatService.sendTextMessage(event.sender.id, "lat: " + coords.lat + " and long: " + coords.lng);
    }else{
      chatService.sendTextMessage(event.sender.id, "Please, fuck off.");
    }
  });
  
}

module.exports = router;
