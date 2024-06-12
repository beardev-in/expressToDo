import express from 'express';
import { userRegisterController, userLoginController, userLogoutController, getLoggedInUserController, updateUserController,
			uploadAvatarController, getAvatarController, deleteAvatarController, deleteUserController } from '../controllers/homeControllers.js';
import { userDetailsValidation, userIdValidation, userDetailsUpdateValidation } from "../middlewares/validationMiddleware.js";
import { sessionsAuthMiddleware, tokenAuthMiddleware} from "../middlewares/authMiddleware.js";
import configureMulter from '../utils/multer.js';

let upload = configureMulter();

const router = express.Router();

router.post("/register", userDetailsValidation(), userRegisterController);
router.post("/login", userLoginController); 
router.get("/avatar/:userId", userIdValidation(), getAvatarController);

//protected -> certain checks can be avoided for protected routes as users cannot access these controllers unless they are authorised
router.use(tokenAuthMiddleware, sessionsAuthMiddleware);
router.get("/logout", userLogoutController);
router.get("/me", getLoggedInUserController);
router.put("/update", userDetailsUpdateValidation(), updateUserController);
router.post("/avatar", upload.single('avatar'), uploadAvatarController);
router.delete("/avatar", deleteAvatarController);
router.delete("/delete", deleteUserController);

export default router