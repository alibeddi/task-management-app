import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { RootState } from "../../redux/store";
import { moveTask, reorderTask } from "../../redux/tasksSlice";
import { Task } from "../../types/task";
import StatusColumn from "../StatusColumn/StatusColumn";
import TaskCard from "../TaskCard/TaskCard";
import TaskForm from "../TaskForm/TaskForm";
import StatusForm from "../StatusForm/StatusForm";
import AddStatusColumn from "../AddStatusColumn/AddStatusColumn";
import { addStatus } from "../../redux/statusesSlice";
import "./BoardView.css";
import TaskFilters from "../TaskFilters/TaskFilters";
import ViewSwitcher from "../ViewSwitcher/ViewSwitcher";

interface BoardViewProps {
  view: "list" | "board";
  setView: (view: "list" | "board") => void;
  searchQuery: string;
}

const BoardView: React.FC<BoardViewProps> = ({
  view,
  setView,
  searchQuery,
}) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const statuses = useSelector((state: RootState) => state.statuses.statuses);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = useState<string>("");

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

    // Apply priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    // Apply due date filter
    if (dueDateFilter) {
      filtered = filtered.filter(
        (task) => task.dueDate && task.dueDate <= dueDateFilter
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((task) => {
        return (
          task.title.toLowerCase().includes(query) ||
          (task.description &&
            task.description.toLowerCase().includes(query)) ||
          task.priority.toLowerCase().includes(query) ||
          (task.assignees &&
            task.assignees.some((assignee) =>
              assignee.name.toLowerCase().includes(query)
            ))
        );
      });
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

  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [placeholderStatus, setPlaceholderStatus] = useState<string | null>(
    null
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    const overTask = tasks.find((t) => t.id === overId);
    const overStatus = statuses.find((s) => s.id === overId);

    if (overTask) {
      const tasksInColumn = getTasksForStatus(overTask.status);
      const overIndex = tasksInColumn.findIndex((t) => t.id === overId);
      setPlaceholderIndex(overIndex);
      setPlaceholderStatus(overTask.status);
    } else if (overStatus) {
      const tasksInColumn = getTasksForStatus(overStatus.id);
      setPlaceholderIndex(tasksInColumn.length);
      setPlaceholderStatus(overStatus.id);
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

    // Check if dropping over a status column
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

    // Check if dropping over another task
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

  const handleAddStatus = (statusName: string) => {
    const nextOrder = statuses.length;
    dispatch(
      addStatus({
        id: Date.now().toString(),
        name: statusName,
        isDefault: false,
        order: nextOrder,
      })
    );
  };

  return (
    <main className="main-content">
      <div className="board-title-section">
        <div className="board-title-wrapper">
          {searchQuery && (
            <div className="search-indicator">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span>Searching for "{searchQuery}"</span>
            </div>
          )}
        </div>
        <div className="board-title-actions">
          <TaskFilters
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dueDateFilter={dueDateFilter}
            setDueDateFilter={setDueDateFilter}
            statuses={statuses}
          />
          <ViewSwitcher view={view} setView={setView} />
        </div>
      </div>

      <div className="board-content">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}>
          <div className="board-columns">
            {sortedStatuses
              .filter(
                (status) => statusFilter === "all" || status.id === statusFilter
              )
              .map((status) => (
                <StatusColumn
                  key={status.id}
                  status={status}
                  tasks={getFilteredTasksForStatus(status.id)}
                  onCreateTask={() => setIsTaskFormOpen(true)}
                />
              ))}

            {statusFilter === "all" && (
              <AddStatusColumn onAddStatus={handleAddStatus} />
            )}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="drag-overlay">
                <TaskCard task={activeTask} />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      {isTaskFormOpen && (
        <div className="modal-overlay">
          <TaskForm onClose={() => setIsTaskFormOpen(false)} />
        </div>
      )}

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

      {isStatusModalOpen && (
        <div className="modal-overlay" style={{ zIndex: 1300 }}>
          <div className="modal-content">
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
              }}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default BoardView;
