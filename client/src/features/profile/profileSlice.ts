import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { initialProfileStateType } from '../types';

// Define the initial state
const initialState: initialProfileStateType = {
    avatarModal: false,
    updatedAge: ""
};


export const uploadAvatar = (formData : FormData) => {
    return async (dispatch : any) => {
        try{
            const response = await axios.post('/api/user/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            dispatch({ type: 'dashboard/uploadedAvatar', payload: {['avatar']: response.data.success.avatar} });
        }catch(error : any){
            console.log(error.response.data.error);
        }
    }
}


export const deleteAvatar = () => {
    return async (dispatch : any) => {
        try{
            await axios.delete('/api/user/avatar');
            dispatch({ type: 'dashboard/deletedAvatar', payload: {['avatar']: undefined} });
        }catch(error : any){
            console.log(error.response.data.error);
        }
    }
}


// Create the profile slice
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateAvatarModal : (state, action) => {
            console.log(action)
            state.avatarModal = action.payload
        },
        updateAge : (state, action) => {
            state.updatedAge = action.payload
        }
    }
});

export const selectProfileInfo = (state: any) => state.profile;

export const { updateAge, updateAvatarModal } = profileSlice.actions;

// Export the reducer
export default profileSlice.reducer;