import UserModel from "../models/User.js"
import TasksModel from "../models/Tasks.js"
import {validationResult} from "express-validator"

/*
API : /api/tasks/add
method : POST
description : user todo insert
*/
async function addTaskController(req, res){
    try{
        const result = validationResult(req);
        const userId = req.userId; 
        if(!result.isEmpty()){
            //exiting tasks are already rendered (fetch api)
            return res.status(400).json({errors : result.array(), success : ''});
        }
        //nested array mongodb push query
        let newTask = new TasksModel({...req.body, userId});
        await newTask.save();
        let updatedTasks = await UserModel.findByIdAndUpdate(userId, {$push : {'tasks' : newTask._id}}, {new : true});
        res.status(200).json({errors : [], success : {msg : `task added!`}});       
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
}


/*
API : /api/tasks/:taskId
method : GET
description : specific todo 
*/
async function getTaskByIdController(req, res) {
    try{
        const result = validationResult(req);
        let taskId = req.params.taskId;
        if(!result.isEmpty()){
            res.send(400).json({errors : result.array(), success : ""});
        }
        let task = await TasksModel.findById(taskId);
        if(!task) return res.status(400).json({success : "", errors : [{msg : "task not found!", path : "userStatus"}]});
        res.status(200).json({success : {task}, errors : []}); 
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]})
    }
}


/*
API : /api/tasks
method : GET
description : all user related todos fetched 
*/
async function getTasksController(req, res){
    try{
        let userId = req.userId;
        let tasksData = await TasksModel.find({userId});
        return res.status(200).json({success : {tasksData}, errors : []}); 
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]})
    }
}



/*
API : /api/tasks/edit/:taskId
method : PUT
description : edit todo
*/
async function editTaskController(req, res) {
    try{
        const result = validationResult(req);
        let taskId = req.params.taskId;
        let userId = req.userId;
        if(!result.isEmpty()){
            return res.status(400).json({errors : result.array(), success : ""})
        }
        const updatedTask = await TasksModel.findByIdAndUpdate(
            taskId,
            {...req.body, userId},
            { new: true}
        );
        if(!updatedTask) return res.status(400).json({ success: "", errors: [{ msg: "task not found!", path: "userStatus" }] });
        res.status(200).json({errors : [], success : {msg : "task edited!"}});          
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
}



/*
API : /api/tasks/delete
method : delete
description : user todo insert
*/
async function deleteTaskController(req, res) {
    try{
        const userId = req.userId;
        let taskId = req.params.taskId;
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(400).json({errors : result.array(), success : ""})
        }
        let task = await TasksModel.findByIdAndDelete(taskId);
        if(!task) return res.status(400).json({ success: "", errors: [{ msg: "task not found!", path: "userStatus" }] });
        const updatedTasks = await UserModel.findByIdAndUpdate(
            userId,
            { $pull: { 'tasks': taskId  } },
            { new: true }
        );
        res.status(200).json({success : {msg : "task deleted successfully", tasks : updatedTasks.tasks}});
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
}


/*
API : /api/tasks/completed
method : get
queryparams : completed - true
description : fetch completed tasks
*/
async function getCompletedTasksController (req, res) {
    try {
        const { completed } = req.query;
        let userId = req.userId;
        const result = validationResult(req);
        if(!result.isEmpty()){
            return res.status(400).json({errors : result.array(), success : ""})
        }
        let task = await IndividualTaskyModel.findOne({ '_id': userId }, { 'tasks': { $elemMatch: { 'taskstatus': Boolean(completed)} } });
        return res.status(200).json({success : {msg : "task successfully fetched", tasks : task.tasks}});
        res.status(400).json({ success: "", errors: [{ msg: "Invalid query parameter!", path: "userStatus" }] });
    } catch (error) {
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
};

/*
API : /api/tasks/limit
method : get
queryparams : limit, skip
description : fetch tasks by pagination
*/
async function getTasksByPaginationController(req, res){
    try{
        const { limit, skip } = req.query;
        const tasks = await TasksModel.find().skip(skip).limit(limit);
        return res.status(200).json({success : {msg : "task successfully fetched", tasks : tasks}});
    }catch(error){
        console.log(error);
        res.status(500).json({errors : [{msg : "server is currently experiencing difficulties, please try again later!", path : "internalerror"}]});
    }
}



export {getTaskByIdController, getTasksController, addTaskController,  editTaskController, deleteTaskController, getCompletedTasksController, getTasksByPaginationController}