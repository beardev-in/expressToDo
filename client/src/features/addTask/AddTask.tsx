import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from "../../components/ui/use-toast";
import { handleAddTask, selectAddTask, updateAddTask, clearFieldErrors } from './addTaskSlice';
import { minDate, maxDate, addTaskType } from '../types';
import store from '../../app/store';

export const AddTaskDialog: React.FC = () => {
    const { toast } = useToast();
    const dispatch = useDispatch();
    const { addTask, fieldErrors }: addTaskType = useSelector(selectAddTask);

    useEffect(() => {
        if (fieldErrors) {
            setTimeout(() => {
                dispatch(clearFieldErrors());
            }, 3000);
        }
    }, [fieldErrors]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(updateAddTask({ [name]: value }));
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add task</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add task</DialogTitle>
                    <DialogDescription>
                        Click save when you're done!
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {fieldErrors && fieldErrors.taskname && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {fieldErrors.taskname}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="taskname" className="text-right">
                            taskname
                        </Label>
                        <Input
                            id="taskname"
                            name="taskname"
                            className="col-span-3"
                            value={addTask.taskname}
                            onChange={handleChange}
                        />
                    </div>
                    {fieldErrors && fieldErrors.deadline && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {fieldErrors.deadline}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deadline" className="text-right">
                            deadline
                        </Label>
                        <Input
                            min={minDate}
                            max={maxDate}
                            type='datetime-local'
                            id="deadline"
                            name="deadline"
                            className="col-span-3"
                            value={addTask.deadline}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={async () => {
                        try {
                            let res = await store.dispatch(handleAddTask(addTask));
                            if (res) {
                                toast({
                                    title: `${addTask.taskname}`,
                                    description: `deadline set @ ${addTask.deadline}`
                                });
                            } else {
                                toast({
                                    title: "Task notification!!",
                                    description: `task added un-successfully`
                                });
                            }
                        } catch (error) {
                            console.log("AddTask dispatch failed!");
                            console.log(error);
                        }
                    }}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskDialog;