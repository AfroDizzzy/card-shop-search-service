var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', async function (req, res, next) {
  
  res.render('index', { hobbyMaster: `${await getHobbyMaster.text()}` });
});

module.exports = router;
