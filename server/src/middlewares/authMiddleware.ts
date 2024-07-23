import {getSession, verifyToken} from '../utils/helpers.js'
import { CustomRequest, NextFunction } from 'express-serve-static-core';
import { Response } from 'express';

//Each have defined types but aren't being recognised by typescript

async function sessionsAuthMiddleware(req : CustomRequest, res : Response, next : NextFunction) {
    try{
        let sessionId : string = req.sessionID;
        let sessionStore = req.sessionStore ;
        let activeSession = await getSession(sessionStore, sessionId);
        if(activeSession){
            //Request interface
            req.userId = activeSession.userId as string;
            next();
        }else{
            return res.status(401).json({error : {msg : "unauthorized request! session not present for this user!", path : "unauthorised"}})
        }
    }catch(error : any){
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}


//used for protected components (independant auth) -> tokens need not tag along solely to deliver user data
async function tokenAuthMiddleware(req : CustomRequest, res : Response) {
    try {
        const token : string = req.headers["x-auth-header"] as string;        
        const decoded = await verifyToken(String(token), String(process.env.JWT_SECRET_KEY));
        if(decoded){
            req.user = decoded;    
            return res.status(200).json({success : {msg : "authorised!", path : "authorised"}})
        }
    } catch (error : any) {
        console.error(error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({error : {msg : "Token expired!", path : "unauthorised"}});
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({error : {msg : "unauthorized request!", path : "unauthorised"}});
        }
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}

export { sessionsAuthMiddleware, tokenAuthMiddleware };
 