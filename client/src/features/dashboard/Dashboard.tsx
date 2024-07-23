import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Toaster } from '../../components/ui/toaster';
import { useToast } from "../../components/ui/use-toast";
import EditTaskDialog from '../editTask/EditTask';
import ProfileTab from '../profile/Profile';
import AddTaskDialog from '../addTask/AddTask';
import { fetchUserTasks, fetchUserInfo, deleteTask, selectDashboardInfo } from './dashboardSlice';
import store from '../../app/store';
import { initialDashboardStateType } from '../types';

const Dashboard: React.FC = () => {
    const { toast } = useToast();

    const { tasks }: initialDashboardStateType = useSelector(selectDashboardInfo);

    useEffect(() => {
        store.dispatch(fetchUserInfo());
        store.dispatch(fetchUserTasks());
    }, []);

    return (
        <>
            <div className="flex flex-col items-end p-4">
                <ProfileTab />
            </div>
            <div>
                <Table>
                    <TableCaption>Your toDo's</TableCaption>
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
                                    <EditTaskDialog task={task} />
                                </TableCell>
                                <TableCell
                                    id={`${task._id}`}
                                    className="cursor-pointer bg-gray-100 hover:bg-gray-300 transition duration-300"
                                    onClick={async () => {
                                        try {
                                            let res = await store.dispatch(deleteTask(task._id))
                                            if (res) {
                                                toast({
                                                    title: `Task deleted`,
                                                    description: `Task deleted successfully!`
                                                });
                                            } else {
                                                toast({
                                                    title: `Task deletion failed`,
                                                    description: `Task deletion was unsuccessful!`
                                                });
                                            }
                                        } catch (error: any) {
                                            console.log("deleteTask dispatch failed!");
                                            console.log(error)
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
                <AddTaskDialog />
            </div>
            <Toaster />
        </>
    );
};

export default Dashboard;