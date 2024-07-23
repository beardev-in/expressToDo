import { configureStore } from '@reduxjs/toolkit'
import registerReducer from '../features/register/registerSlice'
import loginReducer from '../features/login/loginSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import profileReducer from '../features/profile/profileSlice'
import addTaskSlice from '../features/addTask/addTaskSlice'
import editTaskSlice from '../features/editTask/editTaskSlice'

export default configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
    addTask: addTaskSlice,
    editTask: editTaskSlice
  }
})