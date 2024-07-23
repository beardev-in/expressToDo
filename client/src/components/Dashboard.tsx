import React, { useState, useEffect } from 'react'
// import { Table } from './ui/table';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"
import { useToast } from "./ui/use-toast"
import { Toaster } from './ui/toaster';
import axios from 'axios';
import EditTaskDialog from './EditTask';
import ProfileTab from './ProfileTab';
import AddTaskDialog from './AddTask';

export const minDate = new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16);
export const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

export type taskType = {
    taskname: string,
    deadline: string,
    taskstatus: string,
    userId: string,
    _id: string
}

export type editTaskType = {
    taskname: string,
    deadline: string,
    taskstatus: string
}

export type axiosErrorType = {
    errors?: badInput[],
    msg?: string,
    path?: string
}

export type userInfoType = { 
    firstname: string, 
    email: string, 
    age: string, 
    avatar: string | undefined, 
    _id: string, 
    tasks: [], 
    password: string 
}

type badInput = {
    msg: string,
    path: string,
    type: string,
    value: string,
    location: string
}


const Dashboard: React.FC = () => {
    const { toast } = useToast();

    const [tasks, setTasks] = useState<taskType[]>([]);

    const [userDetails, setUserDetails] = useState<userInfoType>({
        firstname: "",
        email: "",
        age: "",
        avatar: undefined, //src accepts string or undefined
        _id: "",
        password: "",
        tasks: [] //ids
    });
    
    async function fetchUserTasks() {
        try {
            let res = await axios.get("/api/tasks");
            setTasks(res.data.success.tasksData);
        } catch (error: any) {
            console.log(error.response.data.error);
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        try {
            await axios.delete(`/api/tasks/delete/${taskId}`);
            await fetchUserTasks();
        } catch (error: any) {
            console.log(error.response.data.error);
        }
    }
   
    useEffect(() => {
        async function fetchUserInfo() {
            try {
                let res = await axios.get("/api/user/me");
                let user = res.data.success.user;
                setUserDetails(user)
            } catch (error: any) {
                console.log(error.response.data.error);
            }
        }
        fetchUserInfo();


        fetchUserTasks();
    }, []);

    return (
        <>
            <div className="flex flex-col items-end p-4">
                <ProfileTab userDetails={userDetails} setUserDetails={setUserDetails} />
            </div>
            {/* TABLE DATA */}
            <div>
                <Table>
                    <TableCaption>your toDo's</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Taskname</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Taskstatus</TableHead>
                            <TableHead>Edit</TableHead>
                            <TableHead>Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task._id}>
                                <TableCell>{task.taskname}</TableCell>
                                <TableCell>{task.deadline}</TableCell>
                                <TableCell>{String(task.taskstatus)}</TableCell>
                                <TableCell
                                    id={`${task._id}`}
                                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 transition duration-300"
                                >
                                    <EditTaskDialog task={task} fetchUserTasks={fetchUserTasks} />
                                </TableCell>
                                <TableCell
                                    id={`${task._id}`}
                                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 transition duration-300"
                                    onClick={async () => {
                                        try {
                                            await handleDeleteTask(task._id);
                                            toast({
                                                title: `${task.taskname}`,
                                                description: `task deleted!`
                                            });
                                        } catch (error) {
                                            toast({
                                                title: `${task.taskname}`,
                                                description: `task deleted unsuccessfully!`
                                            });
                                            console.log(error);

                                        }
                                    }}
                                >
                                    Delete
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                    </TableFooter>
                </Table>
                <AddTaskDialog fetchUserTasks={fetchUserTasks}/>
            </div>
            <Toaster />
        </>
    )
}

export default Dashboard;



