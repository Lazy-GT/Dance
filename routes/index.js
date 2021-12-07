var express = require('express');
var router = express.Router();

const mdbConn = require('../maria'); // 작성한 maria.js를 불러온다.
// connection 은 서버가 켜질 때 app.js 에서 수행되었다.
const pool = mdbConn.getPool();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
