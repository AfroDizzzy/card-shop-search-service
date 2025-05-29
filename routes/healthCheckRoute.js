
var express = require('express');
var router = express.Router();

router.get('/health', async function (req, res, next) {
  res.json({ 
    success: true, 
    message: 'Express JWT Backend Service is running!' 
  });
});

module.exports = router;
