var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var jwt     = require('jsonwebtoken');
var passwordHash = require('password-hash-and-salt');
var morgan = require('morgan');

var jsonParser       = bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' })


var index = require('./server/routes/index');
// var users = require('./routes/users');
var db = require('./server/db.js');
var userModel = require('./server/models/userModel');
 var response = require("./server/component/response")
 var config = require("config");
var logger = require("./server/component/log4j").getLogger('app');


var app = express();
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS

    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/upload', express.static(path.join(__dirname, config.get(config.get("env")+".uploadPath") )));
// specify the folder
app.use(express.static(path.join(__dirname, config.get(config.get("env")+".uploadPath") ))); // multer upload path

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(jsonParser);
 app.use(urlencodedParser);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




// passport init
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
/*
  * this is used to check the user in the database existence
  used in case of the signIn and signUp user
*/
passport.use('login', new LocalStrategy(
  function(username,password, done) {
    console.log("login instercepter  ",username,password);
    userModel.findOne({"username":username}).populate('role').exec(function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // console.log("got user/pass",username,password);
      // console.log("got user/pass >>>>>>>",user.username,user.password);
      passwordHash(password).verifyAgainst(user.password,function(error, verified) {
        //console.log("after verification ",error,user);
        if (error) {
          console.log("error");
          return done(err); }
        else if (!verified) {
           console.log("not verified");
          return done(null, false); }
        else {
          console.log("user validated in passport");
          return done(null, user);
        }
      })
    });
  }
)
);
//
//
passport.use('token',new BearerStrategy(
  function(token, done) {
    jwt.verify(token,config.token.secret, function(err, decoded) {
      if (err) {
        console.log("error in verify token  ",err);
        return done(err,null);
      }
      else if(!decoded) {
        console.log("No  token  ",err);
        return done(null, false);
      }
      else {
         // console.log("yes  token  ",decoded);
         console.log("token true");
        return done(null, decoded);
      }
     });

  }
));
passport.use('superAdmin',new BearerStrategy(
  function(token, done) {
    jwt.verify(token,config.token.secret, function(err, decoded) {
      if (err) {
        //console.log("error in verify token  ",err);
        return done(err,null);
      }
      else if(!decoded) {
        // console.log("No  token  ",err);
        return done(null, false);
      }
      else if(decoded._doc.role.type != "admin"){
        return done(null, false);
      }
      else{
        // console.log("yes  token  ",decoded._doc);
        return done(null, decoded);
      }
     });

  }
));



app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
