var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hi Chào Cậu! Tớ Là Trịnh Công Điền! Cần Gì Liên Hệ Tớ Nhé!' });
});

module.exports = router;
