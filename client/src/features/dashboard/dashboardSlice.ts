import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { initialDashboardStateType } from '../types';
import store from '../../app/store';

// Define the initial state
const initialState: initialDashboardStateType = {
    tasks: [],
    userDetails: {
        firstname: "",
        email: "",
        age: "",
        avatar: undefined,
        _id: "",
        password: "",
        tasks: []
    }
};


export const updateUserInfo = (age : string) => {
    return async (dispatch : any) => {
        try{
            await axios.put('/api/user/update', { age });
            dispatch({ type: 'dashboard/updatedUserInfo', payload: {['age']: age} });
        }catch(error : any){
            console.log(error.response.data.error);
        }
    }
}


// Async thunks
export const fetchUserTasks = () => {
    return async (dispatch : any) => {
        try{
            const response = await axios.get('/api/tasks');
            dispatch({ type: 'dashboard/fetchedUserTasks', payload: response.data.success });
        }catch(error : any) {
            console.log(error.response.data.error);
        }
    }
}

export const fetchUserInfo = () => {
    return async (dispatch : any) => {
        try{
            const response = await axios.get('/api/user/me');
            dispatch({ type: 'dashboard/fetchedUserInfo', payload: response.data.success });
        }catch(error : any) {
            console.log(error.response.data.error);
        }
    }
}

export const deleteTask = (taskId : string) => {
    return async () => {
        try{
            await axios.delete(`/api/tasks/delete/${taskId}`);
            store.dispatch(fetchUserTasks());
            return true;
        }catch(error : any){
            console.log(error.response.data.error);
            return false;
        }
    }
}


// Create the dashboard slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        fetchedUserTasks : (state, action) => {
            state.tasks = action.payload.tasksData
        },
        fetchedUserInfo : (state, action) => {
            state.userDetails = action.payload.user;
        },
        updatedUserInfo : (state, action) => {
            state.userDetails = {...state.userDetails, ...action.payload};
        },
        uploadedAvatar : (state, action) => {
            state.userDetails = {...state.userDetails, ...action.payload};
        },
        deletedAvatar : (state) => {
            state.userDetails = {...state.userDetails, ['avatar']: undefined};
        }
    },
});

export const selectDashboardInfo = (state: any) => state.dashboard;

// export const { fetchedUserTasks, fetchedUserInfo, updatedUserInfo, uploadedAvatar, deletedAvatar } = dashboardSlice.actions;

// Export the reducer
export default dashboardSlice.reducer;