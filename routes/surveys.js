var express = require('express'),
    Survey = require('../models/Survey'),
    Question = require('../models/Question'),
    Answer = require('../models/Answer');
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', '로그인이 필요합니다.');
      res.redirect('/signin');
    }
}

/* GET surveys listing. */
router.get('/', function(req, res, next) {
  Survey.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('surveys/index', {surveys: docs});
  });
});

router.get('/new', needAuth, function(req, res, next) {
  res.render('surveys/new');
});

router.post('/', function(req, res, next) {
  var survey = new Survey({
    title: req.body.title,
    email: req.body.email,
    content: req.body.content
  });

  survey.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/surveys');
  });
});

router.get('/:id', function(req, res, next) {
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

router.post('/:id/questions', function(req, res, next) {
  var question = new Question({
    survey: req.params.id,
    content: req.body.content
  });

  question.save(function(err) {
    if (err) {
      return next(err);
    }
    Survey.findByIdAndUpdate(req.params.id, {$inc: {numQuestion: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + req.params.id);
    });
  });
});

router.get('/:id/questions/:id', function(req, res, next) {
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

router.post('/:id/questions/:id/answers', function(req, res, next) {
  var answer = new Answer({
    question: req.params.id,
    content: req.body.content
  });

  answer.save(function(err) {
    if (err) {
      return next(err);
    }
    Question.findByIdAndUpdate(req.params.id, {$inc: {numAnswer: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + req.body.surveyid + '/questions/' + req.params.id);
    });
  });
});

module.exports = router;
