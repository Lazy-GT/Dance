const tokenModule = require("./../modules/token.js")

// 토큰 처리 미들웨어
// TODO status code에 따른 에러처리 필요함
async function checkToken (req, res, next) {
    var token = req.headers.authorization;
    console.log('checkToken');
    console.log(req.headers.authorization);
    const user = await tokenModule.verify(token);
    req.id = user.id;
    next();
}

module.exports = {
    checkToken: checkToken
}
