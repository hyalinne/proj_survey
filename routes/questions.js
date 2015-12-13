var express = require('express'),
    Question = require('../models/Question'),
    Answer = require('../models/Answer');
var router = express.Router();

router.get('/', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if(err) {
      return next(err);
    }
    Answer.find({quesiton: question.id}, function(err, answers) {
      if(err) {
        return next(err);
      }
      res.render('surverys/quesiton', {question : question, answers : answers});
    });
  });
});

module.exports = router;
