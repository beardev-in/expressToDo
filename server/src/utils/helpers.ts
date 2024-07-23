import jwt from "jsonwebtoken"; 
import { StoreMethods } from "sessions";
import { SessionData } from "sessions";
import { DecodedData } from "helpers";

async function getSessions(sessionStore : StoreMethods): Promise<SessionData[] | null> {
    return new Promise((resolve, reject)=>{
        sessionStore.all((err : Error, sessions : SessionData[] | null) => {
            if (err) {
              reject(err);
            } else {
              resolve(sessions);
            }
          });
    })
}

//jwt token can be used to identify user. req's made with 
async function getSession(sessionStore : StoreMethods, sessionId : string) : Promise<SessionData | null>{
    return new Promise((resolve, reject)=>{
        sessionStore.get(sessionId, (err : Error, sessionData : SessionData | null) => {
            if (err) {
              reject(err);
            } else {
              resolve(sessionData);
            }
          });
    })
}

async function deleteSession(sessionStore : StoreMethods, sessionId : string) : Promise<void>{
    return new Promise((resolve, reject)=>{
        sessionStore.destroy(sessionId, (err : Error) => {
            if (err) {
              reject(err);
            } 
            resolve();
          });
    })
}


async function verifyToken(token : string, secretKey : string) : Promise<DecodedData | undefined>{
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