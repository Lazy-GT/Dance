var express = require('express');
var router = express.Router();

// 토큰 인증 미들웨어
const checkToken = require('./../middlewares/auth.js').checkToken;

const mdbConn = require('../maria'); // 작성한 maria.js를 불러온다.
// connection 은 서버가 켜질 때 app.js 에서 수행되었다.
const pool = mdbConn.getPool();

/* GET home page. */
//유저 USER
router.route('/user').get(function(req, res){
  mdbConn.getUserList()
    .then((rows)=>{
      console.log('user 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//피드 FEED
router.route('/feed').get(function(req, res){
  mdbConn.getFeedList()
    .then((rows)=>{
      console.log('feed 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});

//장르(Genre)
router.route('/genre').get(function(req, res){
  mdbConn.getGenreList()
    .then((rows)=>{
      console.log('Genre 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//지역(Place)
router.route('/place').get(function(req, res){
  mdbConn.getPlaceList()
    .then((rows)=>{
      console.log('Place 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//Image_feed
router.route('/imgfeed').get(function(req, res){
  mdbConn.getImgFeedList()
    .then((rows)=>{
      console.log('Image_feed 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//즐겨찾기(Bookmark_User)
router.route('/bookmark').get(function(req, res){
  mdbConn.getBookmarkList()
    .then((rows)=>{
      console.log('Bookmark 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//평정(Star)
router.route('/star').get(function(req, res){
  mdbConn.getStarList()
    .then((rows)=>{
      console.log('Star 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//커뮤니티(Community)
router.route('/comunity').get(function(req, res){
  mdbConn.getCommunityList()
    .then((rows)=>{
      console.log('Community 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//이미지 커뮤니티(Image_Community)
router.route('/imgcommunity').get(function(req, res){
  mdbConn.getImgCommunityList()
    .then((rows)=>{
      console.log('Image_Community 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//해시태그(Hashtag)
router.route('/hashtag').get(function(req, res){
  mdbConn.getHashtagList()
    .then((rows)=>{
      console.log('Hashtag 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//피드 해시태그(Feed_Hasgtag)
router.route('/feedhashtag').get(function(req, res){
  mdbConn.getFeedHashtagList()
    .then((rows)=>{
      console.log('Feed_Hasgtag 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//커뮤니티 해시태그(Commmunity_Hashtag)
router.route('/communityhasgtag').get(function(req, res){
  mdbConn.getCommunityHasgtagList()
    .then((rows)=>{
      console.log('Commmunity_Hashtag 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});
//유저 커뮤니티(User_Community)
router.route('/usercommunity').get(function(req, res){
  mdbConn.getUserCommunityList()
    .then((rows)=>{
      console.log('User_Community 정보 가져오기');
      res.send(rows);
    })
    .catch((errMsg)=>{
      console.log(errMsg);
    });
});

// TODO
router.route('/api/getProfile').post(checkToken, function(req, res) { // Test
  console.log(req.headers)
  let paramId = req.body.id || req.query.id;
  console.log("getProfile artshake");
  if (pool) { 
    mdbConn.getProfile({id: paramId})
      .then((rows) => {
        console.log(rows[0])
        res.send({result: 'success getProfile', 
        name: rows[0].user_name, introduce: rows[0].user_introduce, photo: rows[0].user_photo, tag: "1년차 댄서", star: "4.5"});
      })
      .catch(() => {
         res.send({result: 'fail getProfile'})
        
      });
  } else {
    res.send({result: 'fail DB connect'})
  }
});

module.exports = router;