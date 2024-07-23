import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { addTaskType, userErrors, badInput } from '../types';
import { fetchUserTasks } from '../dashboard/dashboardSlice';
import store from '../../app/store';

const initialState : addTaskType = {
    addTask : {
        taskname: '',
        deadline: ''
    },
    fieldErrors : null
};


export const handleAddTask = (addTask : addTaskType['addTask']) => {
    return async (dispatch : any) => {
        try{
            await axios.post('/api/tasks/add', addTask);
            store.dispatch(fetchUserTasks());
            return true;
        }catch(error : any){
            dispatch({ type: 'addTask/rejected', payload: error.response.data });
            return false;
        }
    }
}


const addTaskSlice = createSlice({
    name: 'addTask',
    initialState,
    reducers: {
        updateAddTask: (state, action) => {
            state.addTask = { ...state.addTask, ...action.payload };
        },
        rejected: (state, action) => {
            const errorData : userErrors = action.payload.error;
            if (errorData.path === 'badInput') {
              state.fieldErrors = {};
              errorData.errors!.forEach((err : badInput) => {
                state.fieldErrors![err.path] = err.msg;
              });
            } 
        },
        clearFieldErrors: (state) => {
            state.fieldErrors = null;
        },
    },
});

export const selectAddTask = (state: any) => state.addTask;

export const { updateAddTask, clearFieldErrors } = addTaskSlice.actions;

export default addTaskSlice.reducer;