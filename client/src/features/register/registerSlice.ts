import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { badInput, userErrors } from '../types';
import { initialRegisterStateType } from '../types';

// Define the initial state
const initialState: initialRegisterStateType = {
    formData: {
        firstname: '',
        email: '',
        password: '',
        age: ''
    },
    alert: null,
    fieldErrors: null
};

export const registerUser = (formData: initialRegisterStateType["formData"]) => {
    return async (dispatch : any) => {
        try {
            const response = await axios.post('/api/user/register', formData);
            dispatch({ type: 'register/fulfilled', payload: response.data.success });
        } catch (error: any) {
            dispatch({ type: 'register/rejected', payload: error.response.data });
        }
    }
};

// Create the register slice
const registerSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        updateFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        clearAlert: (state) => {
            state.alert = null;
        },
        clearFieldErrors: (state) => {
            state.fieldErrors = null;
        },
        fulfilled: (state, action) => {
            state.alert = {
                type: 'success',
                message: action.payload.msg
            };
            state.formData = initialState.formData; // Clear form data on success
        },
        rejected: (state, action) => {
            const errorData : userErrors = action.payload.error;
            if (errorData.path === 'badInput') {
              state.fieldErrors = {};
              errorData.errors!.forEach((err : badInput) => {
                state.fieldErrors![err.path] = err.msg;
              });
            } else {
              state.alert = {
                type: 'failure',
                message: errorData.msg!
              };
            }
        }
    }
});

export const selectRegisterationInfo = (state : any) => state.register

// Export actions
export const { updateFormData, clearAlert, clearFieldErrors } = registerSlice.actions;

// Export the reducer
export default registerSlice.reducer;