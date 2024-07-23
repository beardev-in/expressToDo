var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
function getSessions(sessionStore) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            sessionStore.all((err, sessions) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(sessions);
                }
            });
        });
    });
}
//jwt token can be used to identify user. req's made with 
function getSession(sessionStore, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            sessionStore.get(sessionId, (err, sessionData) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(sessionData);
                }
            });
        });
    });
}
function deleteSession(sessionStore, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            sessionStore.destroy(sessionId, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });
}
function verifyToken(token, secretKey) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    });
}
export { getSession, deleteSession, getSessions, verifyToken };
