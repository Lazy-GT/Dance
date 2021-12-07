const maria = require('../maria.js');
const pool = maria.getPool();

async function createCommunity(req) {
    console.log('createCommunity');
    console.log(req);
    let conn, rows;

    let type = req.type; 
    let place = req.place;
    let genre = req.genre;
    let title = req.title;
    let total = req.total;
    let thumbnailURL = req.thumbnailURL;
    let term = req.term;
    let detail = req.detail;
    
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake'); //QUERY
        rows = await conn.query("insert into community set commu_type=(?), commu_place=(?), commu_genre=(?), commu_title=(?), commu_total=(?),"
            + " commu_thumbnailURL=(?), commu_term=(?), commu_detail=(?) returning commu_id", 
            [type, place, genre, title, total, thumbnailURL, term, detail]); //QUERY
    }
    catch(err){
        console.log(err);
        throw err;
    }
    finally{
        if (conn) conn.end();
        if (rows) {
            console.log('commu_id: '+rows[0].commu_id);
            return rows[0].commu_id;
        }
    }
}

async function createImageCommunity(communityID, imageURL, isThumbnail){
    console.log('createImageCommunity');
    let conn, rows;

    let _commu_id = communityID;
    let _image_link = imageURL;
    let _isThumbnail = isThumbnail;

    try{
        conn = await pool.getConnection();
        conn.query('USE artshake'); //QUERY
        rows = await conn.query("insert into image_community set commu_id=(?), image_link=(?), isThumbnail=(?) returning image_commu_id",
            [_commu_id, _image_link, _isThumbnail]); //QUERY
    }catch(err){
        console.log(err);
        throw err;
    }finally{
        if(conn) conn.end;
        if (rows) {
            console.log(rows[0]);
            return rows[0];
        }
    }
}

async function createUserCommunity(communityID, userID, status, weight){
    console.log('createUserCommunity');
    let conn, rows;

    let _commu_id = communityID;
    let _user_id = userID;
    let _status = status;
    let _weight = weight;

    try{
        conn = await pool.getConnection();
        conn.query('USE artshake'); //QUERY
        rows = await conn.query("insert into user_community set user_id=(?), commu_id=(?), status=(?), weight=(?) returning user_commu_id",
            [_user_id, _commu_id, _status, _weight]); //QUERY
    }catch(err){
        console.log('err');
        console.log(err);
        throw err;
    }finally{
        if(conn) conn.end;
        if (rows) {
            console.log(rows[0]);
            return rows[0];
        }
    }
}

//커뮤니티(Community)
async function getMeeting(){
    let conn, rows;
    let query = 'SELECT commu_id as "id", commu_type as "type", '
    + '	sub.category AS "place", genre.category as "genre",  '
    + ' commu_title as "title", commu_total as "total", commu_detail as "detail", commu_thumbnailURL AS "thumbnailURL" '
    + '	FROM community, genre, (SELECT id, CONCAT(large_category, " ", medium_category, " ", small_category) AS category FROM place) AS sub '
    + '	WHERE community.commu_genre = genre.id and sub.id = community.commu_place;';
    
    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query(query);
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
async function getMeetingList(type, page){
    let conn, rows;
    let query = 'SELECT commu_id as "id", commu_title as "title", commu_thumbnailURL AS "thumbnailURL",'
    + ' sub.category AS "place", '
    + ' commu_total as "total" '
    + '	FROM community, genre, (SELECT id, CONCAT(large_category, " ", medium_category, " ", small_category) AS category FROM place) AS sub '
    + '	WHERE community.commu_genre = genre.id and sub.id = community.commu_place LIMIT ?, ?;';
    
    let size = 20;
    let offset = page * size; 
    let row_count = size;
    let values = [offset, row_count];

    try{
        conn = await pool.getConnection();
        conn.query('USE artshake');
        rows = await conn.query(query, values);
    }catch(err){
        throw err;
    }finally{
        if(conn) conn.end;
        if(rows) return rows;
    }
}
module.exports = {
    createCommunity: createCommunity,
    createImageCommunity: createImageCommunity,
    createUserCommunity: createUserCommunity,
    getMeeting: getMeeting,

    getMeetingList: getMeetingList
};