import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import sidebarReducer from './sidebarSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
})

export default store
