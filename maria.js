const mariadb = require('mariadb');
const db_config = require('./db_config.js');
const encryption = require('./modules/encryption.js');
const token = require('./modules/token.js');

const pool = mariadb.createPool({
    host: db_config.DBHost, 
    port:db_config.DBPort,
    user: db_config.DBUser, 
    password: db_config.DBPass,
    connectionLimit: 100
});
function getPool() { return pool; }

//유저 정보 가져오기
async function getUserList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM USER');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//feed 정보 가져오기
async function getFeedList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM feed');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}

//장르(Genre)
async function getGenreList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM GENRE');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//지역(Place)
async function getPlaceList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM PLACE');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//Image_feed
async function getImgFeedList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM IMAGE_FEED');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//즐겨찾기(Bookmark user)
async function getBookmarkList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM BOOKMARK_USER');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//평점(Star)
async function getStarList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM STAR');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//커뮤니티(Community)
async function getCommunityList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM COMMUNITY');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//이미지 커뮤니티(Image_Community)
async function getImgCommunityList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM IMAGE_COMMUNITY');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//해시태그(Hashtag)
async function getHashtagList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM HASHTAG');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//피드 해시태그(Feed_Hasgtag)
async function getFeedHashtagList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM FEED_HASHTAG');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//커뮤니티 해시태그(Commmunity_Hashtag)
async function getCommunityHasgtagList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM  COMMUNITY_HASHTAG');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
//유저 커뮤니티(User_Community)
async function getUserCommunityList(){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query('SELECT * FROM USER_COMMUNITY');
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}



async function addUser(req) {
    let conn, rows;
    let salt, password;

    let id = req.id; 
    let name = req.name;
    let raw = req.password;
    let phoneNum = req.phoneNum;
    let email = req.email;
    let type = req.type;
    let photo = req.photo;
    let introduce = req.introduce;
    let genre = req.genre;
    let place = req.place;
    
    try{
        conn = await pool.getConnection();

        await encryption.getPassword(raw)
        .then((res)=>{
            salt = res.salt;
            password = res.password;
            
            conn.query('USE artshake'); //QUERY
            rows = conn.query("insert into user set user_id=(?), user_name=(?), user_pw=(?), user_phoneNum=(?), user_email=(?), user_type=(?),"
            + " user_photo=(?), user_introduce=(?), user_genre=(?), user_place=(?), salt=(?)", 
            [id, name, password, phoneNum, email, type, photo, introduce, genre, place, salt]); //QUERY
            
        });   
    }
    catch(err){
        throw err;
    }
    finally{
        if (conn) conn.end();
        if (rows) 
            return rows;
    }
}

// TODO
async function authUser(req) {
    let conn, fq, sq;
    let id, name, raw, salt, password;
    let jwtToken;
    id = req.id; 
    raw = req.password;
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake'); //QUERY
        fq = await conn.query("select user_id, user_name, salt, user_pw from user where user_id = (?)", id)
            .then((res)=> {
                id = res[0].user_id;
                name = res[0].user_name;
                salt = res[0].salt;
                password = res[0].user_pw;
                sq = encryption.checkPassword(raw, salt, password);
            });
        await token.sign({id:id, name:name}).then((res)=>{
            console.log('authuser res');
            jwtToken = {accessToken: res.token, refreshToken: res.refreshToken};
        });
    }
    catch(err){
        //에러처리 필요함 (ex 중복된 아이디 입력)
        console.log(err);
        throw err;
    }
    finally{
        if (conn) conn.end();
        console.log(sq ? true : false);
        console.log('authuser end '+ jwtToken.accessToken);
        return {id: id, name: name, token: jwtToken}; // 아이디를 찾은 경우 true return
    }
}

async function getProfile(req) {
    let conn, rows;
    let id, name, raw, salt, password;
    id = req.id; 

    try{
        conn = await pool.getConnection();
        conn.query('USE artshake'); //QUERY
        rows = await conn.query("select user_name, user_introduce, user_photo from user where user_id = (?)", id);   
    }
    catch(err){
        //에러처리 필요함 (ex 중복된 아이디 입력)
        throw err;
    }
    finally{
        if (conn) conn.end();
        return rows; // 아이디를 찾은 경우 true return
    }
}

// TODO maria.js
// createCommunity()
// createImageCommunity()
// createUserCommunity()

module.exports = {
    getGenreList:getGenreList,
    getPlaceList:getPlaceList,
    getImgFeedList:getImgFeedList,
    getBookmarkList:getBookmarkList,
    getStarList:getStarList,
    getCommunityList:getCommunityList,
    getImgCommunityList:getImgCommunityList,
    getHashtagList:getHashtagList,
    getFeedHashtagList:getFeedHashtagList,
    getCommunityHasgtagList:getCommunityHasgtagList,
    getUserCommunityList:getUserCommunityList,
    getUserList: getUserList,
    getFeedList: getFeedList,
    addUser: addUser,
    authUser: authUser,
    getPool: getPool,
    getProfile: getProfile
}

// TEST CODE
/*
const reqAdd = {id: 'testID02', name: 'testName02', password: 'hello01'};
const reqAuth = {id: 'testID02', password: 'hello01'};

if (pool) {
    addUser(reqAdd)
    .then((res)=>{
        console.log(res);
        authUser(reqAuth);
    });
}
*/
// TEST CODE END
