import React from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField, Box } from "@mui/material";
import { StatusColumn } from "../../types/status";

interface TaskFiltersProps {
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  dueDateFilter: string;
  setDueDateFilter: (value: string) => void;
  statuses: StatusColumn[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  dueDateFilter,
  setDueDateFilter,
  statuses,
}) => (
  <Box display="flex" gap={2} alignItems="center">
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="priority-filter-label">Priority</InputLabel>
      <Select
        labelId="priority-filter-label"
        value={priorityFilter}
        label="Priority"
        onChange={e => setPriorityFilter(e.target.value)}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </Select>
    </FormControl>
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="status-filter-label">Status</InputLabel>
      <Select
        labelId="status-filter-label"
        value={statusFilter}
        label="Status"
        onChange={e => setStatusFilter(e.target.value)}
      >
        <MenuItem value="all">All</MenuItem>
        {statuses.map(status => (
          <MenuItem key={status.id} value={status.id}>{status.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      size="small"
      label="Due Before"
      type="date"
      value={dueDateFilter}
      onChange={e => setDueDateFilter(e.target.value)}
      InputLabelProps={{ shrink: true }}
    />
  </Box>
);

export default TaskFilters; 