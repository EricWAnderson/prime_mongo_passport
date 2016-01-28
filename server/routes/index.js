var express = require('express');
var path = require('path');
var passport = require('passport');
var User = require('../../models/user');

var router = express.Router();

router.get('/', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/success', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/success.html'));
});

router.get('/failure', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/failure.html'));
});

router.get('/getUser', function(request, response){
    console.log(request.user);
    response.json(request.user);
});

router.get('/register', function(request, response){
    response.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.post('/', passport.authenticate('local', {
   successRedirect: '/success', failureRedirect: '/failure'
}));

router.post('/registerMe', function(request, response){
  User.create(request.body, function(err, post){
      if(err){
          //next(err);
      } else {
          response.redirect('/success');
      }
  });
});

module.exports = router;
