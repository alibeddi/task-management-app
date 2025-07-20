import { useDroppable } from "@dnd-kit/core";
import React from "react";

import { StatusColumn } from "../../types/status";
import { Task } from "../../types/task";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "../TaskCard";
import ListTaskCard from "../ListTaskCard/ListTaskCard";
import { useDispatch } from "react-redux";
import { renameStatus, deleteStatus } from "../../redux/statusesSlice";
import StatusForm from "../StatusForm/StatusForm";
import { SortField } from "../TaskListHeader/TaskListHeader";
import TaskListHeader from "../TaskListHeader/TaskListHeader";

interface StatusColumnProps {
  status: StatusColumn;
  tasks: Task[];
  onCreateTask: () => void;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
}

const ListStatusColumn: React.FC<StatusColumnProps> = ({
  status,
  tasks,
  onCreateTask,
  sortField,
  sortDirection,
  onSort,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  const dispatch = useDispatch();
  const taskIds = tasks.map((task) => task.id);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [editName, setEditName] = React.useState(status.name);

  const handleEdit = () => {
    setIsMenuOpen(false);
    setEditName(status.name);
    setIsEditModalOpen(true);
  };
  const handleDelete = () => {
    setIsMenuOpen(false);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    dispatch(deleteStatus(status.id));
    setShowDeleteConfirm(false);
  };
  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim() && editName !== status.name) {
      dispatch(renameStatus({ id: status.id, newName: editName.trim() }));
    }
    setIsEditModalOpen(false);
  };

  return (
    <section className={`list-status-section ${isOver ? "drag-over" : ""}`}>
      <div className="list-status-header">
        <h3 className="list-status-title">{status.name}</h3>
        <div className="list-status-actions" style={{ position: "relative" }}>
          <svg
            className="list-more-icon"
            width="18"
            height="4"
            viewBox="0 0 18 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => !status.isDefault && setIsMenuOpen((v) => !v)}
            style={{
              cursor: status.isDefault ? "not-allowed" : "pointer",
              opacity: status.isDefault ? 0.3 : 1,
            }}>
            <path
              d="M9 0C8.60444 0 8.21776 0.117298 7.88886 0.337061C7.55996 0.556824 7.30362 0.869181 7.15224 1.23463C7.00087 1.60009 6.96126 2.00222 7.03843 2.39018C7.1156 2.77814 7.30608 3.13451 7.58579 3.41421C7.86549 3.69392 8.22186 3.8844 8.60982 3.96157C8.99778 4.03874 9.39992 3.99913 9.76537 3.84776C10.1308 3.69638 10.4432 3.44004 10.6629 3.11114C10.8827 2.78224 11 2.39556 11 2C11 1.46957 10.7893 0.96086 10.4142 0.585787C10.03914 0.210714 9.53043 0 9 0ZM2 0C1.60444 0 1.21776 0.117298 0.88886 0.337061C0.559962 0.556824 0.303617 0.869181 0.152242 1.23463C0.000866562 1.60009 -0.0387401 2.00222 0.0384303 2.39018C0.115601 2.77814 0.306082 3.13451 0.585787 3.41421C0.865492 3.69392 1.22186 3.8844 1.60982 3.96157C1.99778 4.03874 2.39992 3.99913 2.76537 3.84776C3.13082 3.69638 3.44318 3.44004 3.66294 3.11114C3.8827 2.78224 4 2.39556 4 2C4 1.46957 3.78929 0.96086 3.41421 0.585787C3.03914 0.210714 2.53043 0 2 0ZM16 0C15.6044 0 15.2178 0.117298 14.8889 0.337061C14.56 0.556824 14.3036 0.869181 14.1522 1.23463C14.0009 1.60009 13.9613 2.00222 14.0384 2.39018C14.1156 2.77814 14.3061 3.13451 14.5858 3.41421C14.8655 3.69392 15.2219 3.8844 15.6098 3.96157C15.9978 4.03874 16.3999 3.99913 16.7654 3.84776C17.1308 3.69638 17.4432 3.44004 17.6629 3.11114C17.8827 2.78224 18 2.39556 18 2C18 1.46957 17.7893 0.96086 17.4142 0.585787C17.0391 0.210714 16.5304 0 16 0Z"
              fill="#768396"
            />
          </svg>
          {isMenuOpen && !status.isDefault && (
            <div
              className="list-status-menu"
              style={{
                position: "absolute",
                top: 24,
                right: 0,
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: 6,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                zIndex: 10,
              }}>
              <button className="menu-item" onClick={handleEdit}>
                Edit
              </button>
              <button className="menu-item delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          )}
          <button
            className="list-add-task-btn"
            onClick={() => onCreateTask()}
            aria-label="Add Task">
            <div className="list-add-icon">
              <div className="list-plus-vertical"></div>
              <div className="list-plus-horizontal"></div>
            </div>
          </button>
        </div>
      </div>

      <TaskListHeader
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={onSort}
      />
      <div ref={setNodeRef} className="list-tasks-container">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <ListTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="list-empty-state">
            <p>
              No tasks in this status.
              <br />
              Drop tasks here or click + to add
            </p>
          </div>
        )}
      </div>

      {isEditModalOpen && (
        <div className="modal-overlay">
       
            <StatusForm
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={(name) => {
                if (name.trim() && name !== status.name) {
                  dispatch(
                    renameStatus({ id: status.id, newName: name.trim() })
                  );
                }
                setIsEditModalOpen(false);
              }}
              initialName={status.name}
              submitLabel="Save"
            />
          </div>
        
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay">
          
            <div className="delete-confirm">
              <h3>Delete Status</h3>
              <p>
                Are you sure you want to delete "{status.name}"? This action
                cannot be undone.
              </p>
              <div className="delete-actions">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="cancel-btn">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
   
      )}
    </section>
  );
};

export default ListStatusColumn;
