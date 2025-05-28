var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', async function (req, res, next) {

  
  //you cant render and .json a response. You have to set it in the header
  res.set({
    status: 400
  })  
  res.render('index', { hobbyMaster: `helloworld` });
  // res.json({
  //   success: true,
  //   message: 'Express JWT Backend Service is running!'
  // });
});

module.exports = router;
