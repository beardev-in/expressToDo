import React, { useState } from 'react'
// import { Table } from './ui/table';
import { Button } from './ui/button';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog"
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from "./ui/use-toast"
import axios from 'axios';
import { taskType, editTaskType, minDate, maxDate, axiosErrorType } from './Dashboard';


type Props = {
    task: taskType;
    fetchUserTasks: () => Promise<void>
};

const EditTaskDialog: React.FC<Props> = ({ task, fetchUserTasks }) => {
    const { toast } = useToast();
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string } | null>(null);
    const [editTaskData, setEditTaskData] = useState<editTaskType>({
        taskname: '',
        deadline: '',
        taskstatus: ''
    });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditTaskData({
            ...editTaskData,
            [name]: value,
        });
    };


    const handleEditTask = async (taskId: string) => {
        try {
            await axios.put(`/api/tasks/edit/${taskId}`, editTaskData);
            await fetchUserTasks();
            return true
        } catch (error: any) {
            console.log(error.response.data);
            //accounts for all types of errors
            let userErrors: axiosErrorType = error.response.data.error
            let errorFields: {
                [key: string]: string;
            } = {};

            if (userErrors.path == "badInput") {
                userErrors.errors!.forEach((err) => {
                    errorFields[err.path] = err.msg
                })
                setFieldErrors(errorFields);
            }
            console.log(fieldErrors);
            return false
        } finally {
            setTimeout(() => {
                setFieldErrors(null);
            }, 3000)
        }
    }


    // Your edit task form logic here
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-transparent text-black hover:bg-transparent w-full h-full" onClick={() => { setEditTaskData({ taskname: task.taskname, taskstatus: task.taskstatus, deadline: task.deadline }) }}>Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                        Make changes and click save when you're done!
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {
                        fieldErrors && fieldErrors.taskname &&
                        <Alert variant="destructive">
                            <AlertDescription>
                                {fieldErrors.taskname}
                            </AlertDescription>
                        </Alert>
                    }
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="taskname" className="text-right">
                            Taskname
                        </Label>
                        <Input
                            name="taskname"
                            className="col-span-3"
                            value={editTaskData.taskname}
                            onChange={handleChange}
                        />
                    </div>
                    {
                        fieldErrors && fieldErrors.deadline &&
                        <Alert variant="destructive">
                            <AlertDescription>
                                {fieldErrors.deadline}
                            </AlertDescription>
                        </Alert>
                    }
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                            Deadline
                        </Label>
                        <Input
                            min={minDate}
                            max={maxDate}
                            type='datetime-local'
                            id="deadline"
                            name="deadline"
                            className="col-span-3"
                            value={String(editTaskData.deadline).slice(0, 16)}
                            onChange={handleChange}
                        />
                    </div>
                    {
                        fieldErrors && fieldErrors.taskstatus &&
                        <Alert variant="destructive">
                            <AlertDescription>
                                {fieldErrors.taskstatus}
                            </AlertDescription>
                        </Alert>
                    }
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="taskstatus" className="text-right">
                            taskstatus
                        </Label>
                        <Input
                            name="taskstatus"
                            className="col-span-3"
                            value={editTaskData.taskstatus}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={async () => {
                        try {
                            let res = await handleEditTask(task._id);
                            if(res){
                                toast({
                                    title: "Task notification!!",
                                    description: `task edited successfully`
                                })
                            }else{
                                toast({
                                    title: "Task notification!!",
                                    description: `task edited un-successfully`
                                })
                            }                       
                        }catch(error){
                            console.log(error);
                            
                        }
                    }}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditTaskDialog