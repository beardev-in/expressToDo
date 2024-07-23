import { createSlice } from '@reduxjs/toolkit';
import { editTaskType } from '../types';
import axios from 'axios';
import store from '../../app/store';
import { fetchUserTasks } from '../dashboard/dashboardSlice';
import { userErrors, badInput } from '../types';

const initialState: editTaskType = {
    editTask : {
        taskname: '',
        deadline: '',
        taskstatus: ''
    },
    fieldErrors : null
};

export const handleEditTask = (editTask : editTaskType['editTask'], taskId : string) => {
    return async (dispatch : any) => {
        try{
            await axios.put(`/api/tasks/edit/${taskId}`, editTask);
            store.dispatch(fetchUserTasks());
            return true;
        }catch(error : any){
            dispatch({ type: 'editTask/rejected', payload: error.response.data });
            return false;
        }
    }
}

const editTaskSlice = createSlice({
    name: 'editTask',
    initialState,
    reducers: {
        updateEditTask: (state, action) => {
            state.editTask = { ...state.editTask, ...action.payload };
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
    }
});

export const selectEditTask = (state: any) => state.editTask;

export const { updateEditTask, clearFieldErrors } = editTaskSlice.actions;

export default editTaskSlice.reducer;