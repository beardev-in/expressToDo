import {getSession, verifyToken} from '../utils/helpers.js'
import jwt from "jsonwebtoken"; 

async function sessionsAuthMiddleware(req, res, next){
    try{
        let sessionId = req.sessionID;
        let sessionStore = req.sessionStore;
        let activeSession = await getSession(sessionStore, sessionId);
        if(activeSession){
            req.userId = activeSession.userId;
            next();
        }else{
            return res.status(401).json({errors : [{msg : "unauthorized request! session not present for this user!", path : "unauthorised"}]})
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ errors: [{ msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }] });
    }
}


//used for protected components (independant auth) -> tokens need not tag along solely to deliver user data
async function tokenAuthMiddleware(req, res, next) {
    try {
        const token = req.headers["x-auth-header"];
        const decoded = await verifyToken(token, process.env.JWT_SECRET_KEY);
        if(decoded){
            req.user = decoded;    
            next();
        }
    } catch (error) {
        console.error(error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({errors : [{msg : "Token expired!", path : "unauthorised"}]});
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({errors : [{msg : "unauthorized request!", path : "unauthorised"}]});
        }
        res.status(500).json({ errors: [{ msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }] });
    }
}

export { sessionsAuthMiddleware, tokenAuthMiddleware };
 