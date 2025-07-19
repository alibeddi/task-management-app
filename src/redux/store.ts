import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import statusesReducer from './statusesSlice';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    statuses: statusesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 