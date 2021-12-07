const express = require('express');
const router = express.Router();

const storageCommunity = require('../middlewares/storage.js').community;
const query = require('../query/community');

router.route('/process/imageupload').post(storageCommunity, function(req,res) {
    console.log("community imageUpload");
    let saveuri, user;
    console.log(req.body);
    console.log(req.file);
  
    saveuri = req.file.filename;
    user = req.body.userID;
    
    // 이미지 업로드 과정은 미들웨어 storageCommuniy에서 처리하므로 이 함수에 진입한 경우에는 업로드에 성공함
    res.status(201).send( {result:"imageUpload success", uri: saveuri} ); 
  });

router.route('/make/meeting').post(function(req,res) {
    console.log(req.body); // DEBUG용
    let communityID, is_Thumbnail;

    // step 1 커뮤니티 DB insert -> 커뮤니티 ID를 결과로 받음
    query.createCommunity(req.body)
    .then((commu_id)=>{
        communityID = commu_id;
        console.log('communityID: '+communityID);
        console.log(req.body.hostID);
        // step 2 유저 커뮤니티 DB insert
        query.createUserCommunity(communityID, req.body.hostID, 0, 0); //TODO
        // step 3 이미지 커뮤니티 DB insert : insert할 이미지 주소와 썸네일 주소가 같은지 확인해야 함
        for(let i=0; i<req.body.ImageURL.length; i++) {
            is_Thumbnail = (req.body.ImageURL[i]==req.body.thumbnailURL);
            query.createImageCommunity(communityID, req.body.ImageURL[i], is_Thumbnail);
        }
        res.status(201).send({result: {response: 'create community success', commu_id: communityID} });
    }).catch((err)=>{
        console.log(err);
        res.status(400).send({result: {response: 'create community Fail'} 
        });
    });
});

router.route('/get/meeting').post(function(req, res) {
    // req 없음
    query.getMeeting()
    .then((rows)=>{
        // rows[i] = {type:?, genre:?, ...}
        console.log(rows.length);

        let array = new Array();
        for(let i=0; i<rows.length; i++)
            array.push(rows[i]);
        res.status(200).send(array);


    }).catch((err)=>{
        console.log(err);
        res.status(400).send({result: {response: 'get meeting Fail'} 
        });
    });
});
/********************************************** */
router.route('/test').post(function(req, res) { 
    let json = {
        id: 12,
        isBookMark: true,
        hello: {
            id: "stringID12",
            text: "hi!"
        }
    };
    res.status(200).send(json);
});
router.route('/lists').get(function(req, res) {
    let type = req.query.type;
    let page = req.query.page;

    query.getMeetingList(type, page)
    .then((rows)=>{
        // rows[i] = {type:?, genre:?, ...}
        console.log(rows.length);
        let array = [];
        for(let i=0; i<rows.length; i++) {
            array.push(rows[i]);
        }
            
        res.status(200).send(array);


    }).catch((err)=>{
        console.log(err);
        res.status(400).send({result: {response: 'get meeting Fail'} 
        });
    });
});
router.route('/').get(function(req, res){
    let id = req.query.id;
    
    if(id==null) res.status(400).send();
    let json = {
        id: 1,
        type: "meeting",
        imageList: ["test2.jpg", "28b1e47c0a043c5347b2a1a78345ab8f.jpg"],
        title: "test1",
        place: "서울 강남구 논현동",
        introduce: "테스트입니다.",
        howEntry: "즉시 참여",
        url: "testURL" // 딥링크?를 이용하여 구현해야함
    };
    res.status(200).send(json);
})

module.exports = router;