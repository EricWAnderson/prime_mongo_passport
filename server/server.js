var express = require('express');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var User = require('../models/user');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 60000, secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('server/public'));
app.use('/', index);

//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]
//                           MONGO
//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]

var mongoURI = 'mongodb://localhost:27017/passport_mongo';
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function(err){
   console.log('MongoDB error: ', err);
});

mongoDB.on('open', function(){
   console.log('MongoDB connected!');
});

//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]
//                          PASSPORT
//[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]

passport.serializeUser(function(user, done){
    //place ID on session so we can get user back
   done(null, user.id);
});

passport.deserializeUser(function(id, done){
    //go get User object to req.user
   User.findById(id, function(err, user){
     if(err){
         done(err);
     } else {
       done(null, user); //req.user
     }
   });
});

passport.use('local', new localStrategy({passReqToCallback: true, usernameField: 'username'},
    function(req, username, password, done){

            //connect to db and check password
            User.findOne({username: username}, function(err, user){
                if(err){
                   console.log(err);
                }

                if(!user){
                    done(null, false);
                }

                user.comparePassword(password, function(err, isMatch){
                    if(err){
                       console.log(err);
                    }
                    if(isMatch){
                        done(null, user);  //success
                    } else {
                        done(null, false);  //fail
                    }
                });

            });

}));

var server = app.listen(3000, function(){
   var port = server.address().port;
    console.log('listening on port', port);
});
