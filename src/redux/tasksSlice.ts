import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task, Priority } from "../types/task";

interface TasksState {
  tasks: Task[];
}

const initialState: TasksState = {
  tasks: [
    {
      id: '1',
      title: 'Design homepage',
      description: 'Create the main landing page design',
      dueDate: '2024-07-01',
      priority: 'High',
      status: 'todo',
      order: 0,
    },
    {
      id: '2',
      title: 'Setup backend',
      description: 'Initialize database and server',
      dueDate: '2024-07-03',
      priority: 'Medium',
      status: 'inprogress',
      order: 0,
    },
    {
      id: '3',
      title: 'Write documentation',
      description: 'Document API endpoints',
      dueDate: '2024-07-05',
      priority: 'Low',
      status: 'done',
      order: 0,
    },
    {
      id: '4',
      title: 'Create login page',
      description: 'Develop the login form and authentication logic',
      dueDate: '2024-07-02',
      priority: 'High',
      status: 'todo',
      order: 1,
    },
    {
      id: '5',
      title: 'Implement user roles',
      description: 'Add user role management to backend',
      dueDate: '2024-07-04',
      priority: 'Medium',
      status: 'inprogress',
      order: 1,
    },
    {
      id: '6',
      title: 'Test API endpoints',
      description: 'Write tests for all backend API endpoints',
      dueDate: '2024-07-06',
      priority: 'High',
      status: 'done',
      order: 1,
    },
    {
      id: '7',
      title: 'UI review',
      description: 'Review UI for accessibility and responsiveness',
      dueDate: '2024-07-07',
      priority: 'Low',
      status: 'todo',
      order: 2,
    },
    {
      id: '8',
      title: 'Optimize images',
      description: 'Compress and optimize images for faster load',
      dueDate: '2024-07-08',
      priority: 'Medium',
      status: 'inprogress',
      order: 2,
    },
    {
      id: '9',
      title: 'Deploy to production',
      description: 'Deploy the latest build to the production server',
      dueDate: '2024-07-09',
      priority: 'High',
      status: 'done',
      order: 2,
    },
  ],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state: TasksState, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state: TasksState, action: PayloadAction<Task>) => {
      const idx = state.tasks.findIndex(
        (t: Task) => t.id === action.payload.id,
      );
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
    deleteTask: (state: TasksState, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t: Task) => t.id !== action.payload);
    },
    moveTask: (
      state: TasksState,
      action: PayloadAction<{
        taskId: string;
        newStatus: string;
        newOrder: number;
      }>,
    ) => {
      const { taskId, newStatus, newOrder } = action.payload;
      const task = state.tasks.find((t: Task) => t.id === taskId);
      if (task) {
        task.status = newStatus;
        task.order = newOrder;
      }
    },
    reorderTask: (
      state: TasksState,
      action: PayloadAction<{ taskId: string; newOrder: number }>,
    ) => {
      const { taskId, newOrder } = action.payload;
      const task = state.tasks.find((t: Task) => t.id === taskId);
      if (task) {
        task.order = newOrder;
      }
    },
  },
});

export const { addTask, updateTask, deleteTask, moveTask, reorderTask } =
  tasksSlice.actions;
export default tasksSlice.reducer;
