var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSession, verifyToken } from '../utils/helpers.js';
//Each have defined types but aren't being recognised by typescript
function sessionsAuthMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let sessionId = req.sessionID;
            let sessionStore = req.sessionStore;
            let activeSession = yield getSession(sessionStore, sessionId);
            if (activeSession) {
                //Request interface
                req.userId = activeSession.userId;
                next();
            }
            else {
                return res.status(401).json({ error: { msg: "unauthorized request! session not present for this user!", path: "unauthorised" } });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
//used for protected components (independant auth) -> tokens need not tag along solely to deliver user data
function tokenAuthMiddleware(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.headers["x-auth-header"];
            const decoded = yield verifyToken(String(token), String(process.env.JWT_SECRET_KEY));
            if (decoded) {
                req.user = decoded;
                return res.status(200).json({ success: { msg: "authorised!", path: "authorised" } });
            }
        }
        catch (error) {
            console.error(error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: { msg: "Token expired!", path: "unauthorised" } });
            }
            else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: { msg: "unauthorized request!", path: "unauthorised" } });
            }
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
export { sessionsAuthMiddleware, tokenAuthMiddleware };
