import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { userErrors } from '../types';
import { initialLoginStateType } from '../types';

// Define the initial state
const initialState: initialLoginStateType = {
    formData: {
        email: '',
        password: ''
    },
    alert: null,
};

export const loginUser = (formData: initialLoginStateType["formData"]) => {
    return async (dispatch: any) => {
        try {
            const response = await axios.post('/api/user/login', formData);
            let userInfo : {firstname : string, token : string} = {
                firstname : response.data.success.user,
                token : response.data.success.authtoken
              }
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
            dispatch({ type: 'register/fulfilled', payload: response.data.success });
        } catch (error: any) {
            dispatch({ type: 'register/rejected', payload: error.response.data });
        }
    }
};

// Create the register slice
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        updateFormData: (state, action) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        clearAlert: (state) => {
            state.alert = null;
        },
        fulfilled: (state, action) => {
            state.alert = {
                type: 'success',
                message: action.payload.msg
            };
            state.formData = initialState.formData; // Clear form data on success
        },
        rejected: (state, action) => {
            const errorData: userErrors = action.payload.error;
            state.alert = {
                type: 'failure',
                message: errorData.msg!
            };
        }
    }
});

export const selectLoginInfo = (state: any) => state.login

// Export actions
export const { updateFormData, clearAlert } = loginSlice.actions;

// Export the reducer
export default loginSlice.reducer;