var express = require('express');
var router = express.Router();

//Config
var config = require('./../config');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IIRS BACKEND API' });
});

module.exports = router;
