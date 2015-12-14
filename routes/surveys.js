var express = require('express'),
    User = require('../models/User'),
    Survey = require('../models/Survey'),
    Question = require('../models/Question'),
    Answer = require('../models/Answer');
var router = express.Router();

// user's list & new
router.get('/user/:id', function(req, res, next) {
  Survey.find({user : req.params.id}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('surveys/index', {surveys: docs});
  });
});

router.get('/new/:id', function(req, res, next) {
  User.find({id : req.params.id}, function(err, user) {
    if(err) {
      next(err);
    }
     res.render('surveys/new', {user : user});
   });
});

router.post('/user/:id', function(req, res, next) {
  var survey = new Survey({
    user: req.params.id,
    title: req.body.title,
    content: req.body.content
  });

  survey.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/surveys/user/' + req.params.id);
  });
});

// create survey
router.get('/survey/:id', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    Question.find({survey: survey.id}, function(err, questions) {
      if (err) {
        return next(err);
      }
      res.render('surveys/show', {survey: survey, questions: questions});
    });
  });
});

router.post('/survey/:id/question', function(req, res, next) {
  var question = new Question({
    survey: req.params.id,
    type: req.body.type,
    content: req.body.content
  });
  Survey.findById(req.params.id, function(req, survey) {
    survey.numQuestions = survey.numQuestions + 1;
    survey.save(function(err) { });
  });

  question.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/surveys/survey/' + req.params.id);
  });
});

router.get('/survey/:id/question/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if(err) {
      return next(err);
    }
    Answer.find({question: question.id}, function(err, answers) {
      if(err) {
        return next(err);
      }
      res.render('surveys/question', {surveyid : question.survey, question : question, answers : answers});
    });
  });
});

router.post('/survey/:id/question/:id', function(req, res, next) {
  var answer = new Answer({
    question: req.params.id,
    content: req.body.content
  });

  answer.save(function(err) {
    if (err) {
      return next(err);
    }
  });

  res.redirect('/surveys/survey/' + req.body.surveyid + '/question/' + req.params.id);
});

router.get('/survey/:id/question-text/:id', function(req, res, next) {
  Answer.find({question : req.params.id}, function(err, answers){
    Question.findById(req.params.id, function(err, question) {
      res.render('surveys/question', {surveyid : question.survey, question : question, answers : answers});
    });
  });
});

// do survey
router.get('/:id', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if(err) {
      return next(err);
    }
    Question.find({survey : survey.id}, function(err, questions) {
      if(err) {
        return next(err);
      }
      res.render('surveys/survey', {survey : survey, questions : questions});
    });
  });
});

router.get('/complete/:id', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    survey.numComplete = survey.numComplete + 1;
    survey.save(function(err) {
      next(err);
    });
    res.render('surveys/complete');
  });
});

router.get('/:id/question/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if(err) {
      return next(err);
    }
    if(question.type === 1) {
      Answer.find({question : question.id}, function(err, answers) {
        if(err) {
          return next(err);
        }
        res.render('surveys/survey-question-select', {surveyid : question.survey, question : question, answers : answers});
      });
    } else {
      res.render('surveys/survey-question-text', {surveyid : question.survey, question : question});
    }
  });
});

router.post('/:id/question-select/:id', function(req, res, next) {
  Answer.findOne({content : req.body.value}, function(err, answer) {
    if(err) {
      return next(err);
    }
    answer.numSelected = answer.numSelected + 1;
    answer.save(function(err) {
      if (err) {
        return next(err);
      }
    });
    res.redirect('/surveys/' + req.body.surveyid + '/question/' + req.params.id);
  });
});

router.post('/:id/question-text/:id', function(req, res, next) {
  var answer = new Answer({
    question: req.params.id,
    content: req.body.content
  });

  answer.save(function(err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect('/surveys/' + req.body.surveyid + '/question/' + req.params.id);
});
module.exports = router;
