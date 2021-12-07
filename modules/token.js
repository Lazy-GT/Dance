const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = 'TESTSECRETKEY'; //TEST 실제 사용시에는 외부에 공개되면 안 됨
const options = {
    algorithm : "HS256", // 해싱 알고리즘
    expiresIn : "30m",  // 토큰 유효 기간
    issuer : "issuer" // 발행자 (TEST)
};
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
/*
로그아웃
토큰을 블랙리스트에 저장 -> 저장된 토큰은 30분 뒤 삭제
인증과정 시 블랙리스트 조회 필요함..

*/
async function sign(user) { //refresh
        console.log('sign '+user.id);
        console.log(user.name);
        const payload = {
            id: user.id,
            name: user.name,
        };
        const result = {
            //sign메소드를 통해 access token 발급!
            token: jwt.sign(payload, secretKey, options),
            refreshToken: randToken.uid(256)
        };
        return result;
}

async function verify(token) {
    let decoded;
    try {
        // verify를 통해 값 decode!
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        if (err.message === 'jwt expired') {
            console.log('expired token');
            return TOKEN_EXPIRED;
        } else if (err.message === 'invalid token') {
            console.log('invalid token');
            console.log(TOKEN_INVALID);
            return TOKEN_INVALID;
        } else {
            console.log("invalid token");
            return TOKEN_INVALID;
        }
    }
    return decoded;
}

/*
const createBlackList = require('jwt-blacklist').createBlackList;
import { createBlackList } from 'jwt-blacklist';
 
// memory
const blacklist = await createBlackList({
  daySize: 10000, // optional, number of tokens need revoking each day
  errorRate: 0.001, // optional, error rate each day
});
 
// redis
const blacklist = await createBlackList({
  daySize: 10000, // optional, number of tokens need revoking each day
  errorRate: 0.001, // optional, error rate each day
  storeType: 'redis', // store type
  redisOptions: {
    host: 'localhost',
    port: 6379,
    key: 'jwt-blacklist', // optional: redis key prefix
  }, // optional, redis options
});
*/
module.exports = {
    sign: sign,
    verify: verify
}
