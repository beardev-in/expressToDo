import bcrypt from "bcrypt";
import UserModel from "../models/User.js"
import {validationResult} from "express-validator"
import {redisClient} from "../utils/sessions.js"
import jwt from "jsonwebtoken"; 
import {getSession, deleteSession} from "../utils/helpers.js"
import path from "path"
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

//admin manually inserted
async function userRegisterController(req, res) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array(), success: "" });
        }
        const { firstname, email, password, age } = req.body;
        // Check if the user already exists
        let user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists", path: "userStatus" }], success: "" });
        }
        const salt = bcrypt.genSaltSync(12);
        const hashedPwd = bcrypt.hashSync(password, salt);
        // Insert the user with the obtained addressId
        let newUser = new UserModel({firstname, email, password : hashedPwd, age});
        await newUser.save();
        res.status(200).json({success : { msg: 'User registered successfully', username: newUser.user_firstname }, errors : []});
    } catch (error) {
        console.error(error);
        res.status(500).json({ errors: [{ msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }] });
    }
}



/*
    API: /api/user/login
    Method: POST
    Desc: Logs in a user
    Access: Public
    Notes: This endpoint verifies the user's credentials (email and password) against the database. If the credentials are valid, it creates a session for the user and stores session data in Redis.
*/
async function userLoginController(req, res) {
    try {
        let { email, password } = req.body;
        let userAgent = req.headers['user-agent'];
        let user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({success : "", errors : [{ msg : "Invalid email or password", path : "unauthorised" }]});
        }
        //activeSessions fetched upon login
        let userSessionData = await redisClient.get(user._id.toString()); 
        userSessionData = JSON.parse(userSessionData);
        //user has logged in before
        if (userSessionData && userSessionData.activeSession == req.sessionID) {
            return res.status(200).json({ message: "you are already logged in here!" });
        } else if (userSessionData && userSessionData.activeSession != req.sessionID) {
            return res.status(200).json({ message: "you are already logged in elsewhere!" });
        } else if (!userSessionData) {
            await redisClient.set(user._id.toString(), `${JSON.stringify({ activeSession: req.sessionID })}`, 'EX', 14400);    
        } 
        let payload = { userId : user._id, admin : false};
        let accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn : "4h"});
        //information stored on sessionStore (supported by redisStore)
        req.session.admin = false;
        req.session.userId = user._id.toString(); 
        req.session.userAgent = req.headers['user-agent'];
        res.status(200).json({success : { msg: "Logged in successfully", authtoken : accessToken}, errors : []});
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }] });
    }
}



/*
    API: /api/user/logout
    Method: GET
    Desc: Logs out a user
    Access: Private (requires authentication)
    Notes: This endpoint deletes the user's session from the session store and removes the current session ID from the active sessions list stored in Redis.
*/
async function userLogoutController(req, res) {
    try {
        //session is deleted from sessionStore (stops reflecting on redis) -> redisStore is configured to manage sessionStore here
        await deleteSession(req.sessionStore, req.sessionID);
        let userSessionData = await redisClient.del(req.userId);
        //cleared cookie for corresponsing request
        res.clearCookie('connect.sid').json({success : { msg: "User logged out!"}, errors : []});
    } catch (error) {
        console.log(error);
        res.status(500).json({ errors: [{ msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }] });
    }
}


/*
    API: /api/user/me
    Method: GET
    Desc: gets a user using sessionID details
    Access: Private (requires auth)
    Notes: Fetches user details based on jwt token / session ID (sessionStore holds userId info).
*/
async function getLoggedInUserController(req, res){
    try{
        let userId = req.userId;
        let user = await UserModel.findById(userId);
        res.status(200).json({success : { user }, errors : []});
    }catch{
        res.status(500).json({ errors: [{ msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }] });
    }
}


/*
API : /api/user/update
method : PUT
desc : edit user info
Access: Private (requires auth)
Notes: API call to edit any user related info (not sensitive info like email/pwd). 
*/
async function updateUserController(req, res) {
    try{
        if(!(Object.keys(req.body).length == 1 && req.body.age)){
            return res.status(400).json({errors : [{msg : "only user related info can be updated!"}], success : ""});
        }
        const result = validationResult(req);
        const userId = req.userId;
        if(!result.isEmpty()){
            return res.status(400).json({errors : result.array(), success : ""})
        }
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { ...req.body }},
            { new: true }
        );
        res.status(200).json({errors : [], success : {msg : "user detailes edited successfully!"}});
    }catch(error){
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]})
    }
}


/*
API : /api/user/avatar
method : POST
desc : upload user avatar
Access: Private (requires auth)
Notes: API call to upload user avatar file
*/
async function uploadAvatarController(req, res){
    try{
        if (!req.file) {
            return res.status(400).json({errors : [{msg : "no file upload was found!"}], success : ""})
        }
        const file = req.file;
        const avatar = file.originalname;
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.userId,
            { $set: { avatar }},
            { new: true }
        );
        res.status(200).json({errors : [], success : {msg : "user avatar uploaded!"}});
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
}

/*
API : /api/user/avatar/:userId
method : GET
desc : get user avatar
Access: public
Notes: API call to upload user avatar file
*/
async function getAvatarController(req, res) {
    try{
        let userId  = req.params.userId;
        let user = await UserModel.findById(userId);
        if(!user || !user.avatar) return res.status(400).json({errors : [{msg : "avatar not found!"}], success : ""})
        //import.meta.url -> meta-property that contains the URL of the current module/file (controllers). It returns the file URL of the module.
        const __filename = fileURLToPath(import.meta.url); //converted to absolute file path
        const __dirname = path.dirname(__filename); //Extracts the directory path from the absolute file path 
        const fileDirectory = path.join(__dirname, '../uploads'); //joins directory path with uploads
        const filePath = path.join(fileDirectory, user.avatar);
        // Send the file as a response
        res.status(200).sendFile(filePath);
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
   
};


/*
API : /api/user/avatar
method : DELETE
desc : delete user avatar
Access: private
Notes: API call to delete user avatar file (if existing)
*/
async function deleteAvatarController(req, res){
    try{
        const user = await UserModel.findById(req.userId);
        //user may not have uploaded avatar
        if (!user.avatar) {
            return res.status(400).json({ error: "user avatar not found for this user!" });
        }
        const __filename = fileURLToPath(import.meta.url); //path to current file (module) converted from file url
        const __dirname = path.dirname(__filename);
        const fileDirectory = path.join(__dirname, '../uploads'); 
        const filePath = path.join(fileDirectory, user.avatar);
        await fs.unlink(filePath);
        //delete file reference
        user.avatar = "";
        await user.save();
        res.status(200).json({errors : [], success : {msg : "user avatar deleted!"}});
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
}


/*
API : /api/user/delete
method : DELETE
desc : delete user avatar
Access: private
Notes: API call to delete user 
*/
async function deleteUserController(req, res){
    try{
        let userId = req.userId;
        await UserModel.findByIdAndDelete(userId);
        await deleteSession(req.sessionStore, req.sessionID);
        await redisClient.del(userId);
        res.status(200).json({errors : [], success : {msg : "user deleted!"}});
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
}

export {userRegisterController, userLoginController, userLogoutController, getLoggedInUserController, updateUserController, uploadAvatarController
        ,getAvatarController, deleteAvatarController, deleteUserController}