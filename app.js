const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const crypto = require('crypto');
const fs = require('fs');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login'); 
const communityRouter = require('./routes/community');

const app = express();
const maria = require('./maria');
const pool = maria.getPool();

const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const bodyParser = require('body-parser');
const static = require('serve-static');

const passport = require('passport'); // 여기와
const passportConfig = require('./middlewares/passport'); // 여기



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/img', static(path.join(__dirname, 'img'))); //이미지 저장 경로

app.use(cookieParser());
app.use(expressSession({
  secret: 'my key',  //TEST CODE
  resave: false,
  saveUninitialized: true
 }));

 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/community', communityRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/* 

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

app.use(passport.initialize()); // passport 구동
passportConfig(passport); // 이 부분 추가

module.exports = app;
