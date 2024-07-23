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
import { axiosErrorType, minDate, maxDate } from './Dashboard';

type Props = {
    fetchUserTasks : () => Promise<void>
}

const AddTaskDialog: React.FC<Props> = ({fetchUserTasks}) => {
    const { toast } = useToast();
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string } | null>(null);
    const [addTaskData, setAddTaskData] = useState({
        taskname: '',
        deadline: ''
    });

    const handleAddTask = async () => {
        try {
            await axios.post("/api/tasks/add", addTaskData);
            await fetchUserTasks();
            setAddTaskData({ taskname: "", deadline: "" });
            return true;
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
            return false;
        } finally {
            setTimeout(() => {
                setFieldErrors(null);
            }, 3000)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddTaskData({
            ...addTaskData,
            [name]: value,
        });
    };

    return(
    <>
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
                            taskname
                        </Label>
                        <Input
                            id="taskname"
                            name="taskname"
                            className="col-span-3"
                            value={addTaskData.taskname}
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
                            deadline
                        </Label>
                        <Input
                            min={minDate}
                            max={maxDate}
                            type='datetime-local'
                            id="deadline"
                            name="deadline"
                            className="col-span-3"
                            value={addTaskData.deadline}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={async () => {
                        try {
                            let res = await handleAddTask();
                            if (res) {
                                toast({
                                    title: `${addTaskData.taskname}`,
                                    description: `deadline set @ ${addTaskData.deadline}`
                                });
                            } else {
                                toast({
                                    title: "Task notification!!",
                                    description: `task added un-successfully`
                                });
                            }

                        } catch (error) {
                            console.log(error);
                        }
                    }}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
    )
}

export default AddTaskDialog;