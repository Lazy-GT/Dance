const crypto = require('crypto');

const iter = 100000;
const keylen = 64;
const saltlen = 64;

async function getPassword(raw) {
    const salt = await new Promise((resolve, reject) => {
        crypto.randomBytes(saltlen, (err, buf) => {
            if (err){
                reject(err);
            }
            const salt = buf.toString('base64');
            resolve(salt);
        })
    });
    const password = await new Promise((resolve, reject) => {
        crypto.pbkdf2(raw, salt, iter, keylen, 'sha512', (err, key) => {
            if (err){
                reject(err);
            }
            const result = key.toString('base64');
            const json = {salt: salt, password: result};
            resolve(json);
        })
    });
    return password;
}

async function checkPassword(raw, salt, password) {
    const ret = await new Promise((resolve, reject) => {
        crypto.pbkdf2(raw, salt, iter, keylen, 'sha512', (err, key) => {
            if (err){
                reject(err);
            }
            const result = key.toString('base64') === password;
            resolve(result);
          });
    });
    return ret;
}

module.exports = {
    getPassword: getPassword,
    checkPassword: checkPassword
}

// TEST CODE
/*
const raw = 'hello';
let salt, password;

getPassword(raw)      
    .then((res) => {
        console.log('raw: ' + raw);
        console.log(res);
        salt = res.salt;
        password = res.password;

        checkPassword(raw, salt, password)
            .then((res)=>{
                console.log(res);
            });
    })
    .catch(() => { 

    });
*/
// TEST CODE END
