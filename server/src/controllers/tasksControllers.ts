import UserModel from "../models/User.js"
import TasksModel from "../models/Tasks.js"
import {validationResult} from "express-validator"
import { CustomRequest, Response } from "express-serve-static-core";


/*
API : /api/tasks/add
method : POST
description : user todo insert
*/
async function addTaskController(req : CustomRequest, res : Response){
    try{
        const result = validationResult(req);
        const userId = req.userId; 
        if(!result.isEmpty()){
            //exiting tasks are already rendered (fetch api)
            return res.status(400).json({error : {errors : result.array(), path : 'badInput'}});
        }
        //nested array mongodb push query
        let newTask = new TasksModel({...req.body, userId});
        await newTask.save();
        let updatedTasks = await UserModel.findByIdAndUpdate(userId, {$push : {'tasks' : newTask._id}}, {new : true});
        res.status(200).json({success : {msg : `task added!`}});
    }catch(error){
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}


/*
API : /api/tasks/:taskId
method : GET
description : specific todo 
*/
async function getTaskByIdController(req : CustomRequest, res : Response) {
    try{
        const result = validationResult(req);
        let taskId = req.params.taskId;
        if(!result.isEmpty()){
            return res.status(400).json({error : {errors : result.array(), path : 'badInput'}});
        }
        let taskData = await TasksModel.findById(taskId);
        if(!taskData) return res.status(400).json({error : {msg : "task not found!", path : "userStatus"}});
        res.status(200).json({success: {taskData}}); 
    }catch(error){
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}


/*
API : /api/tasks
method : GET
description : all user related todos fetched 
*/
async function getTasksController(req : CustomRequest, res : Response){
    try{
        let userId = req.userId;
        let tasksData = await TasksModel.find({userId});
        res.status(200).json({success: {tasksData}}); 
    }catch(error){
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}



/*
API : /api/tasks/edit/:taskId
method : PUT
description : edit todo
*/
async function editTaskController(req : CustomRequest, res : Response) {
    try{
        const result = validationResult(req);
        let taskId = req.params.taskId;
        let userId = req.userId;
        if(!result.isEmpty()){
            return res.status(400).json({error : {errors : result.array(), path : 'badInput'}});
        }
        const updatedTask = await TasksModel.findByIdAndUpdate(
            taskId,
            {...req.body, userId},
            { new: true}
        );
        if(!updatedTask) return res.status(400).json({error : { msg: "task not found!", path: "userStatus" }});
        res.status(200).json({success: {msg : "task edited!"}}); 
    }catch(error){
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}



/*
API : /api/tasks/delete
method : delete
description : user todo insert
*/
async function deleteTaskController(req : CustomRequest, res : Response) {
    try{
        const userId = req.userId;
        let taskId = req.params.taskId;
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(400).json({error : {errors : result.array(), path : 'badInput'}});
        }
        let task = await TasksModel.findByIdAndDelete(taskId);
        if(!task) return res.status(400).json({error : { msg: "task not found!", path: "userStatus"}});
        const updatedTasks = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { 'tasks': taskId  } },
            { new: true }
        );
        res.status(200).json({success: {msg : "task deleted successfully"}}); 
    }catch(error){
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}


/*
API : /api/tasks/completed
method : get
queryparams : completed - true
description : fetch completed tasks
*/
async function getCompletedTasksController (req : CustomRequest, res : Response) {
    try {
        const { completed } = req.query;
        let userId = req.userId;
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(400).json({error : {errors : result.array(), path : 'badInput'}});
        }
        let tasks = await TasksModel.find({ userId: userId, taskstatus:  Boolean(completed) });
        res.status(200).json({success: {msg : "completed task successfully fetched", tasks}}); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
};

/*
API : /api/tasks/limit
method : get
queryparams : limit, skip
description : fetch tasks by pagination
*/
async function getTasksByPaginationController(req : CustomRequest, res : Response){
    try{
        const { limit, skip } = req.query;
        const tasks = await UserModel.findById(req.userId, { tasks: { $slice: [skip, limit] }}).populate('tasks');
        res.status(200).json({success: {msg : `${skip} - ${Number(limit) + Number(skip)}`, tasks}}); 

    }catch(error){
        console.log(error);
        return res.status(500).json({error : { msg: "Server is currently experiencing difficulties, please try again later!", path: "internalerror" }});
    }
}



export {getTaskByIdController, getTasksController, addTaskController,  editTaskController, deleteTaskController, getCompletedTasksController, getTasksByPaginationController}