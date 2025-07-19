import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StatusColumn } from "../types/status";

interface StatusesState {
  statuses: StatusColumn[];
}

const defaultStatuses: StatusColumn[] = [
  { id: "todo", name: "To Do", isDefault: true, order: 1 },
  { id: "inprogress", name: "In Progress", isDefault: true, order: 2 },
  { id: "done", name: "Done", isDefault: true, order: 3 },
];

const initialState: StatusesState = {
  statuses: defaultStatuses,
};

const statusesSlice = createSlice({
  name: "statuses",
  initialState,
  reducers: {
    addStatus: (state: StatusesState, action: PayloadAction<StatusColumn>) => {
      state.statuses.push(action.payload);
    },
    renameStatus: (
      state: StatusesState,
      action: PayloadAction<{ id: string; newName: string }>
    ) => {
      const status = state.statuses.find((s) => s.id === action.payload.id);
      if (status) status.name = action.payload.newName;
    },
    deleteStatus: (state: StatusesState, action: PayloadAction<string>) => {
      const status = state.statuses.find((s) => s.id === action.payload);
      if (status && !status.isDefault) {
        state.statuses = state.statuses.filter((s) => s.id !== action.payload);
      }
    },
    reorderStatus: (
      state: StatusesState,
      action: PayloadAction<{ id: string; newOrder: number }>
    ) => {
      const status = state.statuses.find((s) => s.id === action.payload.id);
      if (status) status.order = action.payload.newOrder;
    },
  },
});

export const { addStatus, renameStatus, deleteStatus, reorderStatus } =
  statusesSlice.actions;
export default statusesSlice.reducer;
