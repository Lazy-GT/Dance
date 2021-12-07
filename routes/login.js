var express = require('express');
var router = express.Router();
const token = require('../modules/token');
const passport = require('passport');


// 토큰 인증 미들웨어
const checkToken = require('./../middlewares/auth.js').checkToken;

const mdbConn = require('../maria'); // 작성한 maria.js를 불러온다.
// connection 은 서버가 켜질 때 app.js 에서 수행되었다.
const pool = mdbConn.getPool();

/* GET users listing. */
// TODO 로그인 시 토큰 발급
router.post('/process/login', async (req, res, next) => {
  // https://stackoverflow.com/questions/47140332/passport-authenticate-callback-not-being-executed
  // https://chanyeong.com/blog/post/28
  console.log(req.body.id + ' ' + req.body.password); //TEST
  
  try {
    passport.authenticate('local', function (err, user, info) {
      console.log('user: '+user); //TEST
      console.log('info: '+info); //TEST
      if (user)
        res.status(200).send({result: 'success login', id: user.id, name: user.name, token: user.token.accessToken});
      if (err) 
        res.status(400).send({result: info});
     }) (req,res,next)
  } catch (err) {
    console.log(err);
  }
});

router.post('/process/logout', checkToken, async (req, res, next) => {
  console.log("로그아웃 process");
  /* 세션(쿠키)를 이용하여 로그인을 처리할 경우 서버에 저장된 세션을 파기

     stateless한 JWT의 특성상 JWT를 이용하여 로그인을 처리할 경우에 서버에서 토큰 블랙리스트를 사용하지 않는 경우면
     서버에서는 클라이언트에게 토큰을 파기하라는 요청을 하는 것말고는 할 수 있는게 없음
     
     클라이언트는 서버의 응답을 받은 후에 토큰을 파기하고 로그인 화면으로 이동 (or app 종료)

     블랙리스트를 사용하는 경우
     토큰을 블랙리스트에 저장 -> 저장된 토큰은 30분(기본 유효기간) 이후에 파기됨
     * 인증 시 블랙리스트를 조회하는 과정이 필요해짐 (서버에 저장되는 데이터의 양은 세션을 사용하는 경우 보다는 적음)

     자세한 정보: 
     https://code-machina.github.io/2019/09/01/Security-On-JSON-Web-Token.html
     https://velopert.com/2350
     https://redbinalgorithm.tistory.com/420


  */
  res.status(201).send({result: 'logout OK', logout: true}); 
});

router.route('/process/adduser').post(function(req, res) { // 회원가입 라우터
  //test code
  //TODO
  /*
  let paramId = req.body.id || req.query.id;
  let paramPassword = req.body.password || req.query.password;    
  let paramName = req.body.name || req.query.name;    
  */

  let json = {id:'enfl8539', name:'이성민', password:'dltjdals1!', phoneNum:'01075539809', email: 'hg03017@naver.com', type:0,
  photo:'test2.jpg', introduce:'안녕하세요. 26살입니다.', genre:5, place:64};

  if (pool) { // 서버가 DB와 연결되어 있는 경우
    mdbConn.addUser(json)
      .then((addedUser) => { // 회원가입 성공
        res.send({result: 'success register'})
      })
      .catch(() => { // 회원가입 실패 
         res.send({result: 'fail register'})
        
      });
  } else { // DB 연결 실패
    res.send({result: 'fail DB connect'})
  }
});
  

/*
router.route('/process/logout').post(checkToken, function(req, res) { // 로그아웃 라우터

});
  

router.route('/process/login2').post(function(req, res) { // 로그인 라우터 구 코드
  const paramId = req.body.userid;
  const paramPassword = req.body.password;    
  
  console.log(paramId);
  console.log(paramPassword);
  try {
    if (pool) { // 서버가 DB와 연결되어 있는 경우
      mdbConn.authUser({id: paramId, password: paramPassword})
        .then((row) => { // 로그인 성공
          console.log("로그인 성공 %s %s", row.id, row.name);
          res.status(200).send({result: 'success login', id: row.id, name: row.name, token: row.token.accessToken});  
        })
        .catch(() => { // 로그인 실패
          res.send({result: 'fail login'});
        });
    } else { // DB 연결 실패
      res.status(400).send({result: 'fail DB connect'});
    }
  } catch (err) {
    console.log(err);
  }
});
*/
/*
router.route('/test').post(function(req,res) {
  console.log(req.body);
  console.log(req.body.data)
  const result =  {'result2': { 'testInt': 1, 'testString': 'hello world'} }; // result2는 android studio에서 사용하는 변수명과 같아야함
  console.log(result.result2);
  res.status(200).send(result);
  
});
*/

module.exports = router;