var express = require('express');
var router = express.Router();
var xmlparser = require('xml2js').parseString;

/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1,2,3] });
});

router.get('/test/:id', function(req, res, next) {
  res.render('test', {output: req.params.id});
});

router.post('/test/submit', function(req, res, next) {
  res.redirect('/test/...');
});
*/

// Route that receives a POST request to /text
router.post('/test', function (req, res, next) {
  xmlparser(req.body.text, function (err, result) {
    console.log(JSON.stringify(result.PrintLetterBarcodeData.$.uid))
  })
  res.render('text', { title: 'Cool, huh!', request: JSON.stringify(req.body) })
})

router.get('/', function (req, res, next) {
  res.render('index', { title: 'form bharo' });
})



module.exports = router