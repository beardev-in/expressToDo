var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserModel from "../models/User.js";
import TasksModel from "../models/Tasks.js";
import { validationResult } from "express-validator";
/*
API : /api/tasks/add
method : POST
description : user todo insert
*/
function addTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            const userId = req.userId;
            if (!result.isEmpty()) {
                //exiting tasks are already rendered (fetch api)
                return res.status(400).json({ error: { errors: result.array(), path: 'badInput' } });
            }
            //nested array mongodb push query
            let newTask = new TasksModel(Object.assign(Object.assign({}, req.body), { userId }));
            yield newTask.save();
            let updatedTasks = yield UserModel.findByIdAndUpdate(userId, { $push: { 'tasks': newTask._id } }, { new: true });
            res.status(200).json({ success: { msg: `task added!` } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/tasks/:taskId
method : GET
description : specific todo
*/
function getTaskByIdController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            let taskId = req.params.taskId;
            if (!result.isEmpty()) {
                return res.status(400).json({ error: { errors: result.array(), path: 'badInput' } });
            }
            let taskData = yield TasksModel.findById(taskId);
            if (!taskData)
                return res.status(400).json({ error: { msg: "task not found!", path: "userStatus" } });
            res.status(200).json({ success: { taskData } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/tasks
method : GET
description : all user related todos fetched
*/
function getTasksController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userId = req.userId;
            let tasksData = yield TasksModel.find({ userId });
            res.status(200).json({ success: { tasksData } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/tasks/edit/:taskId
method : PUT
description : edit todo
*/
function editTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = validationResult(req);
            let taskId = req.params.taskId;
            let userId = req.userId;
            if (!result.isEmpty()) {
                return res.status(400).json({ error: { errors: result.array(), path: 'badInput' } });
            }
            const updatedTask = yield TasksModel.findByIdAndUpdate(taskId, Object.assign(Object.assign({}, req.body), { userId }), { new: true });
            if (!updatedTask)
                return res.status(400).json({ error: { msg: "task not found!", path: "userStatus" } });
            res.status(200).json({ success: { msg: "task edited!" } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/tasks/delete
method : delete
description : user todo insert
*/
function deleteTaskController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            let taskId = req.params.taskId;
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ error: { errors: result.array(), path: 'badInput' } });
            }
            let task = yield TasksModel.findByIdAndDelete(taskId);
            if (!task)
                return res.status(400).json({ error: { msg: "task not found!", path: "userStatus" } });
            const updatedTasks = yield UserModel.findByIdAndUpdate(userId, { $pull: { 'tasks': taskId } }, { new: true });
            res.status(200).json({ success: { msg: "task deleted successfully" } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
/*
API : /api/tasks/completed
method : get
queryparams : completed - true
description : fetch completed tasks
*/
function getCompletedTasksController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { completed } = req.query;
            let userId = req.userId;
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ error: { errors: result.array(), path: 'badInput' } });
            }
            let tasks = yield TasksModel.find({ userId: userId, taskstatus: Boolean(completed) });
            res.status(200).json({ success: { msg: "completed task successfully fetched", tasks } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
;
/*
API : /api/tasks/limit
method : get
queryparams : limit, skip
description : fetch tasks by pagination
*/
function getTasksByPaginationController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { limit, skip } = req.query;
            const tasks = yield UserModel.findById(req.userId, { tasks: { $slice: [skip, limit] } }).populate('tasks');
            res.status(200).json({ success: { msg: `${skip} - ${Number(limit) + Number(skip)}`, tasks } });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ error: { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" } });
        }
    });
}
export { getTaskByIdController, getTasksController, addTaskController, editTaskController, deleteTaskController, getCompletedTasksController, getTasksByPaginationController };
