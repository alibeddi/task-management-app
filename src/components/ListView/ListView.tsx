import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { RootState } from "../../redux/store";
import { moveTask, reorderTask } from "../../redux/tasksSlice";
import { addStatus } from "../../redux/statusesSlice";
import TaskCard from "../TaskCard/TaskCard";
import { Task } from "../../types/task";
import TaskForm from "../TaskForm/TaskForm";
import StatusForm from "../StatusForm/StatusForm";
import TaskFilters from "../TaskFilters/TaskFilters";
import ViewSwitcher from "../ViewSwitcher/ViewSwitcher";
import "./ListView.css";
import ListStatusColumn from "../ListStatusColumn/ListStatusColumn";

type ListViewProps = {
  view: "list" | "board";
  setView: (view: "list" | "board") => void;
  searchQuery: string;
};

const ListView: React.FC<ListViewProps> = ({ view, setView, searchQuery }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const statuses = useSelector((state: RootState) => state.statuses.statuses);

  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dueDateFilter, setDueDateFilter] = React.useState<string>("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
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

  return (
    <div className="list-view-container">
      <main className="list-main-content">
        <div className="list-title-section">
          <div className="list-title-wrapper">
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
          <div className="list-title-actions">
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

        <div className="list-content">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            {sortedStatuses
              .filter(
                (status) => statusFilter === "all" || status.id === statusFilter
              )
              .map((status) => {
                const tasksForStatus = getFilteredTasksForStatus(status.id);

                return (
                  <ListStatusColumn
                    key={status.id}
                    status={status}
                    tasks={tasksForStatus}
                    onCreateTask={() => setIsTaskFormOpen(true)}
                  />
                );
              })}

            <DragOverlay>
              {activeTask && (
                <div className="drag-overlay">
                  <TaskCard task={activeTask} />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Floating Add Task Button */}
        <button
          onClick={() => setIsTaskFormOpen(true)}
          className="floating-btn floating-add-task"
          aria-label="Add Task">
          +
        </button>

        {/* Floating Add Status Button */}
        <button
          onClick={() => setIsStatusModalOpen(true)}
          className="floating-btn floating-add-status"
          aria-label="Add Status"
          title="Add Status Column">
          ≡
        </button>

        {/* Task Form Modal */}
        {isTaskFormOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <TaskForm onClose={() => setIsTaskFormOpen(false)} />
            </div>
          </div>
        )}

        {/* Status Form Modal */}
        {isStatusModalOpen && (
          <div className="modal-overlay">
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
    </div>
  );
};

export default ListView;
