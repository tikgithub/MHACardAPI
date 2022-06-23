var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'LVBMHACard API',
    host: req.headers.host
  });
});

module.exports = router;