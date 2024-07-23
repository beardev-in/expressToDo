import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleEditTask, updateEditTask, clearFieldErrors, selectEditTask } from './editTaskSlice';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from "../../components/ui/use-toast";
import { Alert, AlertDescription } from '../../components/ui/alert';
import { editTaskType, taskType, minDate, maxDate } from '../types';
import store from '../../app/store';

type Props = {
    task: taskType;
};

const EditTask: React.FC<Props> = ({ task }) => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { editTask, fieldErrors }: editTaskType = useSelector(selectEditTask);

    useEffect(() => {
        if (fieldErrors) {
            setTimeout(() => {
                dispatch(clearFieldErrors());
            }, 3000);
        }
    }, [fieldErrors])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(value);
        
        dispatch(updateEditTask({
            ...editTask,
            [name]: value,
        }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-transparent text-black hover:bg-transparent w-full h-full" onClick={() => { dispatch(updateEditTask({ taskname: task.taskname, taskstatus: task.taskstatus, deadline: task.deadline })) }}>Edit</Button>
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
                            value={editTask.taskname}
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
                            value={String(editTask.deadline).slice(0, 16)}
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
                            Taskstatus
                        </Label>
                        <Input
                            name="taskstatus"
                            className="col-span-3"
                            value={editTask.taskstatus}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={async()=>{
                        try{
                            let res = await store.dispatch(handleEditTask(editTask, task._id));
                            if(res){
                                toast({
                                    title: "Task notification!!",
                                    description: `Task edited successfully`
                                });
                            }else{
                                toast({
                                    title: "Task notification!!",
                                    description: `Task edited unsuccessfully`
                                });
                            }
                        }catch(error){
                            console.log("EditTask dispatch failed!");
                            console.log(error);
                        }
                    }}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditTask;