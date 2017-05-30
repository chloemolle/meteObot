var express = require('express');
var router = express.Router();

/* GET hello world page. */
router.get('/', function(req, res, next) {
  res.send('BC2BDF2FF576CA3F169AE4AAB8A9F');
});

module.exports = router;
