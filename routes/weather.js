var express = require('express');
var router = express.Router();

/* GET hello world page. */
router.get('/', function(req, res, next) {
  res.send('hello');
});

module.exports = router;
