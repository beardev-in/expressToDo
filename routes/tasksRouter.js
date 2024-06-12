import express from "express";
import { taskDataValidation, taskIdValidation, taskstatusValidation, tasksCompletionQueryValidation } from "../middlewares/validationMiddleware.js";
import { getTaskByIdController, getTasksController, addTaskController,  editTaskController, deleteTaskController,  getCompletedTasksController, getTasksByPaginationController} from "../controllers/tasksControllers.js";
import { sessionsAuthMiddleware, tokenAuthMiddleware} from "../middlewares/authMiddleware.js";
const router = express.Router();



router.use(tokenAuthMiddleware, sessionsAuthMiddleware);

router.get("/completed", 
    tasksCompletionQueryValidation(),
    getCompletedTasksController);

router.get("/paginate", 
    getTasksByPaginationController);

router.get("/", 
    getTasksController);

router.get("/:taskId", 
    taskIdValidation(),
    getTaskByIdController);

router.post("/add", 
    taskDataValidation(),
    addTaskController);

router.put("/edit/:taskId", 
    taskstatusValidation(),
    taskDataValidation(),
    taskIdValidation(),
    editTaskController);

router.delete("/delete/:taskId", 
    taskIdValidation(),
    deleteTaskController);




export default router