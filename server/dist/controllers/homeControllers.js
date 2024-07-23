var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import TasksModel from "../models/Tasks.js";
import { validationResult } from "express-validator";
import { redisClient } from "../utils/sessions.js";
import jwt from 'jsonwebtoken';
import { deleteSession } from "../utils/helpers.js";
import path from "path";
import { fileURLToPath } from 'url'; //function is used to convert a file URL to a file path. (necessary for ES6)
import fs from 'fs/promises';
/*
Since ES6 modules lack the __dirname and __filename variables that are automatically provided in CommonJS,
fileURLToPath is used to generate these paths manually.

fileURLToPath Converts the URL format (file://) provided by import.meta.url into a standard file path that
Node.js and the path module can work with.
- url of file is the location of the module file being executed
- ES6 modules use the import.meta.url property (contains url of current module).
*/
/*
    API: /api/user/register
    Method: POST
    Desc: Register a user org
    Access: Public
    Notes: This is the common end-point for Individual registration
*/
function userRegisterController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ error: { errors: result.array(), path: "badInput" } });
            }
            const { firstname, email, password, age } = req.body;
            // Check if the user already exists
            let user = yield UserModel.findOne({ email });
            if (user) {
                return res.status(400).json({ error: { msg: "User already exists", path: "userStatus" } });
            }
            const salt = bcrypt.genSaltSync(12);
            const hashedPwd = bcrypt.hashSync(password, salt);
            // Insert the user with the obtained addressId
            let newUser = new UserModel({ firstname, email, password: hashedPwd, age });
            yield newUser.save();
            res.status(200).json({ success: { msg: 'User registered successfully', username: newUser.firstname } });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
function userLoginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { email, password } = req.body;
            let user = yield UserModel.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: { msg: "Invalid email", path: "userStatus" } });
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: { msg: "Invalid password", path: "unauthorised" } });
            }
            //activeSessions fetched upon login
            let userSessionDataRaw = yield redisClient.get(user._id.toString());
            let userSessionData = JSON.parse(String(userSessionDataRaw));
            //user has logged in before
            if (userSessionData && userSessionData.activeSession == req.sessionID) {
                return res.status(400).json({ error: { msg: "you are already logged in here!", path: "userStatus" } });
            }
            else if (userSessionData && userSessionData.activeSession != req.sessionID) {
                return res.status(400).json({ error: { msg: "you are already logged in elsewhere!", path: "userStatus" } });
            }
            else if (!userSessionData) {
                yield redisClient.set(String(user._id), JSON.stringify({ activeSession: req.sessionID }), {
                    EX: 14400 // expiration time in seconds
                });
            }
            const secretKey = process.env.JWT_SECRET_KEY;
            let payload = { userId: user._id, admin: false };
            let accessToken = jwt.sign(payload, secretKey, { expiresIn: "4h" });
            //information stored on sessionStore (supported by redisStore)
            req.session.admin = false;
            req.session.userId = user._id.toString();
            req.session.userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : "";
            return res.status(200).json({ success: { msg: "Logged in successfully", authtoken: accessToken, user: user.firstname } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
    API: /api/user/logout
    Method: GET
    Desc: Logs out a user
    Access: Private (requires authentication)
    Notes: This endpoint deletes the user's session from the session store and removes the current session ID from the active sessions list stored in Redis.
*/
function userLogoutController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //session is deleted from sessionStore (stops reflecting on redis) -> redisStore is configured to manage sessionStore here
            yield deleteSession(req.sessionStore, req.sessionID);
            let userSessionData = yield redisClient.del(req.userId);
            //cleared cookie for corresponsing request
            res.clearCookie('connect.sid');
            return res.status(200).json({ success: { msg: "User logged out!", path: "userStatus" } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
    API: /api/user/me
    Method: GET
    Desc: gets a user using sessionID details
    Access: Private (requires auth)
    Notes: Fetches user details based on jwt token / session ID (sessionStore holds userId info).
*/
function getLoggedInUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = req.userId;
            let user = yield UserModel.findById(userId);
            res.status(200).json({ success: { user } });
        }
        catch (_a) {
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/user/update
method : PUT
desc : edit user info
Access: Private (requires auth)
Notes: API call to edit any user related info (not sensitive info like email/pwd).
*/
function updateUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!(Object.keys(req.body).length == 1 && req.body.age)) {
                return res.status(400).json({ error: { msg: "only user related info can be updated!", path: "userStatus" } });
            }
            const result = validationResult(req);
            const userId = req.userId;
            if (!result.isEmpty()) {
                return res.status(400).json({ error: { errors: result.array(), path: "BadInput" } });
            }
            const updatedUser = yield UserModel.findByIdAndUpdate(userId, { $set: Object.assign({}, req.body) }, { new: true });
            res.status(200).json({ success: { msg: "user detailes edited successfully!" } });
        }
        catch (error) {
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/user/avatar
method : POST
desc : upload user avatar
Access: Private (requires auth)
Notes: API call to upload user avatar file
*/
function uploadAvatarController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.file) {
                return res.status(400).json({ error: { msg: "no file upload was found!", path: "userStatus" } });
            }
            const file = req.file;
            const avatar = file.originalname;
            const updatedUser = yield UserModel.findByIdAndUpdate(req.userId, { $set: { avatar } }, { new: true });
            res.status(200).json({ success: { msg: "user avatar uploaded!", avatar } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/user/avatar/:userId
method : GET
desc : get user avatar
Access: public
Notes: API call to upload user avatar file
*/
function getAvatarController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = req.params.userId;
            let user = yield UserModel.findById(userId);
            if (!user || !user.avatar)
                return res.status(400).json({ error: { msg: "avatar not found!", path: "userStatus" } });
            //import.meta.url -> meta-property that contains the URL of the current module/file (controllers). It returns the file URL of the module.
            const __filename = fileURLToPath(import.meta.url); //converted to absolute file path
            const __dirname = path.dirname(__filename); //Extracts the directory path from the absolute file path 
            const fileDirectory = path.join(__dirname, '../uploads'); //joins directory path with uploads
            const filePath = path.join(fileDirectory, user.avatar);
            // Send the file as a response
            res.status(200).sendFile(filePath);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
;
/*
API : /api/user/avatar
method : DELETE
desc : delete user avatar
Access: private
Notes: API call to delete user avatar file (if existing)
*/
function deleteAvatarController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield UserModel.findById(req.userId);
            //user may not have uploaded avatar
            if (!user || !user.avatar) {
                return res.status(400).json({ error: { error: "user avatar not found for this user!", path: "userStatus" } });
            }
            const __filename = fileURLToPath(import.meta.url); //path to current file (module) converted from file url
            const __dirname = path.dirname(__filename);
            const fileDirectory = path.join(__dirname, '../uploads');
            const filePath = path.join(fileDirectory, user.avatar);
            yield fs.unlink(filePath);
            //delete file reference
            user.avatar = "";
            yield user.save();
            res.status(200).json({ success: { msg: "user avatar deleted!" } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/user/delete
method : DELETE
desc : delete user avatar
Access: private
Notes: API call to delete user
*/
function deleteUserController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = req.userId;
            yield UserModel.findByIdAndDelete(userId);
            yield TasksModel.deleteMany({ userId });
            yield deleteSession(req.sessionStore, req.sessionID);
            yield redisClient.del(userId);
            res.status(200).json({ success: { msg: "user deleted!" } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
export { userRegisterController, userLoginController, userLogoutController, getLoggedInUserController, updateUserController, uploadAvatarController, getAvatarController, deleteAvatarController, deleteUserController };
