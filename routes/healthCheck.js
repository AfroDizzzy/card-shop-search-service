
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Express JWT Backend Service is running!' 
  });
});
module.exports = router;
