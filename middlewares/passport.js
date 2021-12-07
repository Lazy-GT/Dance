const passport = require('passport');
const LocalStrategy = require('passport-local');
const maria = require('../maria');
const pool = maria.getPool();

const passportConfig = { usernameField: 'id', passwordField: 'password' };

const passportVerify = async (id, password, done) => {
  try {
    /*
    const user = await maria.findId({ id: userId }); // 아이디 조회 코드 넣어야함
    if (!user) { // 아이디 조회 실패
      done(null, false, { result: '존재하지 않는 사용자 입니다.' });
      return;
    }*/
    if(pool) {
      const user = await maria.authUser({ id: id, password: password }); // 비밀번호 조회 코드 넣어야 함
      if (!user) { // 비밀번호 검증 실패
        return done(null, false, { result: '올바르지 않은 비밀번호 입니다.' });
      }
      // 인증 성공
      console.log('user find '+user); //TEST
      return done(null, user);
    }
  } catch (error) {
    console.error(error);
    return done(error);
  }
};

module.exports = (passport) => {
  passport.use('local', new LocalStrategy(passportConfig, passportVerify));
};