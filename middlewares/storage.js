const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// 이미지 파일을 서버에 저장하는 미들웨어
const storage = multer.diskStorage({
    destination: './img/', // 이미지가 저장될 폴더의 경로
    filename: function(req, file, cb) {
      return crypto.pseudoRandomBytes(16, function(err, raw) {
        if (err) {
          return cb(err);
        }
        return cb(null, "" + (raw.toString('hex')) + (path.extname(file.originalname)));
      });
    }
  });

  module.exports = {
    community: multer({storage: storage}).single('community') // 커뮤니티 이미지 업로드 시 사용하는 미들웨어
  };