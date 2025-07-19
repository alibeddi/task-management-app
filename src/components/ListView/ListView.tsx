import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  List,
  ListItem,
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import EventIcon from "@mui/icons-material/Event";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { moveTask, reorderTask } from "../../redux/tasksSlice";
import { addStatus } from "../../redux/statusesSlice";
import TaskCard from "../TaskCard/TaskCard";
import { Task } from "../../types/task";
import TaskForm from "../TaskForm/TaskForm";
import StatusForm from "../StatusForm/StatusForm";
import TaskFilters from "../TaskFilters/TaskFilters";

type ListViewProps = {
  view: string;
  setView: (view: "list" | "board") => void;
};

const ListView: React.FC<ListViewProps> = ({ view, setView }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const statuses = useSelector((state: RootState) => state.statuses.statuses);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [newStatusName, setNewStatusName] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = React.useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const sortedStatuses = [...statuses].sort((a, b) => a.order - b.order);

  const getTasksForStatus = (statusId: string) => {
    return tasks
      .filter((task) => task.status === statusId)
      .sort((a, b) => a.order - b.order);
  };

  // Filtered tasks helper
  const getFilteredTasksForStatus = (statusId: string) => {
    let filtered = getTasksForStatus(statusId);
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }
    if (dueDateFilter) {
      filtered = filtered.filter(
        (task) => task.dueDate && task.dueDate <= dueDateFilter
      );
    }
    return filtered;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;
    // Dropping over a status column
    const targetStatus = statuses.find((s) => s.id === overId);
    if (targetStatus) {
      const tasksInTargetStatus = getTasksForStatus(targetStatus.id);
      const newOrder = tasksInTargetStatus.length;
      dispatch(
        moveTask({
          taskId: activeId,
          newStatus: targetStatus.id,
          newOrder,
        })
      );
      return;
    }
    // Dropping over another task
    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) {
      if (activeTask.status === overTask.status) {
        // Reordering within the same column
        const tasksInColumn = getTasksForStatus(activeTask.status);
        const activeIndex = tasksInColumn.findIndex((t) => t.id === activeId);
        const overIndex = tasksInColumn.findIndex((t) => t.id === overId);
        if (activeIndex !== overIndex) {
          const newTasks = arrayMove(tasksInColumn, activeIndex, overIndex);
          newTasks.forEach((task, index) => {
            dispatch(reorderTask({ taskId: task.id, newOrder: index }));
          });
        }
      } else {
        // Moving to a different column
        const tasksInTargetColumn = getTasksForStatus(overTask.status);
        const overIndex = tasksInTargetColumn.findIndex((t) => t.id === overId);
        dispatch(
          moveTask({
            taskId: activeId,
            newStatus: overTask.status,
            newOrder: overIndex,
          })
        );
      }
    }
  };

  const DroppableStatusSection: React.FC<{
    status: (typeof statuses)[number];
    tasksForStatus: Task[];
    taskIds: string[];
    children?: React.ReactNode;
  }> = ({ status, tasksForStatus, taskIds }) => {
    const { setNodeRef } = useDroppable({ id: status.id });
    return (
      <Paper
        ref={setNodeRef}
        sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: "grey.50" }}>
        <Typography
          variant="h6"
          gutterBottom
          fontWeight={600}
          color="secondary.main">
          {status.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <List>
            {tasksForStatus.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </List>
        </SortableContext>
        {tasksForStatus.length === 0 && (
          <Box sx={{ color: "text.secondary", fontStyle: "italic", p: 2 }}>
            No tasks in this status.
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <main className="main-content">
      <div
        className="board-title-section"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}>
        <h1 className="board-title" style={{ margin: 0 }}>
          🔥 Task
        </h1>
        <button
          style={{
            marginBottom: 16,
            padding: "10px 20px",
            fontWeight: 600,
            borderRadius: 8,
            border: "none",
            background: "#5051F9",
            color: "#fff",
            cursor: "pointer",
          }}
          onClick={() => setView(view === "list" ? "board" : "list")}>
          Switch to {view === "list" ? "Board" : "List"} View
        </button>
        <TaskFilters
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dueDateFilter={dueDateFilter}
          setDueDateFilter={setDueDateFilter}
          statuses={statuses}
        />
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <Box display="flex" flexDirection="column" gap={3}>
          {sortedStatuses
            .filter(
              (status) => statusFilter === "all" || status.id === statusFilter
            )
            .map((status) => {
              const tasksForStatus = getFilteredTasksForStatus(status.id);
              const taskIds = tasksForStatus.map((task) => task.id);
              return (
                <DroppableStatusSection
                  key={status.id}
                  status={status}
                  tasksForStatus={tasksForStatus}
                  taskIds={taskIds}
                />
              );
            })}
        </Box>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
      {/* Floating Add Task Button */}
      <button
        onClick={() => setIsTaskFormOpen(true)}
        style={{
          position: "fixed",
          bottom: 40,
          right: 40,
          zIndex: 1200,
          background: "#5051F9",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 32,
          boxShadow: "0 4px 16px rgba(80,81,249,0.15)",
          cursor: "pointer",
        }}
        aria-label="Add Task">
        +
      </button>
      {/* Modal for TaskForm */}
      {isTaskFormOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: 0,
              minWidth: 350,
              maxWidth: "90vw",
            }}>
            <TaskForm onClose={() => setIsTaskFormOpen(false)} />
          </div>
        </div>
      )}
      {/* Floating Add Status Button */}
      <button
        onClick={() => setIsStatusModalOpen(true)}
        style={{
          position: "fixed",
          bottom: 120,
          right: 40,
          zIndex: 1200,
          background: "#fff",
          color: "#5051F9",
          border: "2px solid #5051F9",
          borderRadius: "50%",
          width: 60,
          height: 60,
          fontSize: 32,
          boxShadow: "0 4px 16px rgba(80,81,249,0.10)",
          cursor: "pointer",
        }}
        aria-label="Add Status"
        title="Add Status Column">
        ≡
      </button>
      {/* Modal for Status Form */}
      {isStatusModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: 0,
              minWidth: 350,
              maxWidth: "90vw",
            }}>
            <StatusForm
              onClose={() => setIsStatusModalOpen(false)}
              onSubmit={(name) => {
                const nextOrder = statuses.length;
                dispatch(
                  addStatus({
                    id: Date.now().toString(),
                    name,
                    isDefault: false,
                    order: nextOrder,
                  })
                );
                setIsStatusModalOpen(false);
                setNewStatusName("");
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default ListView;
