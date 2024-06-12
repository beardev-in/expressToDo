import jwt from "jsonwebtoken"; 

async function getSessions(sessionStore){
    return new Promise((resolve, reject)=>{
        sessionStore.all((err, sessions) => {
            if (err) {
              reject(err);
            } else {
              resolve(sessions);
            }
          });
    })
}

//jwt token can be used to identify user. req's made with 
async function getSession(sessionStore, sessionId){
    return new Promise((resolve, reject)=>{
        sessionStore.get(sessionId, (err, sessionData) => {
            if (err) {
              reject(err);
            } else {
              resolve(sessionData);
            }
          });
    })
}

async function deleteSession(sessionStore, sessionId){
    return new Promise((resolve, reject)=>{
        sessionStore.destroy(sessionId, (err) => {
            if (err) {
              reject(err);
            } 
            resolve();
            //also pop sessionId
          });
    })
}


async function verifyToken(token, secretKey){
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
}

export {getSession, deleteSession, getSessions, verifyToken}