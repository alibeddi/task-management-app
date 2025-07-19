import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch } from "react-redux";
import { deleteTask } from "../../redux/tasksSlice";
import { Task } from "../../types/task";
import TaskForm from "../TaskForm/TaskForm";
import "./TaskCard.css";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deleteTask(task.id));
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "#EF4444";
      case "Medium":
        return "#F59E0B";
      case "Low":
        return "#10B981";
      default:
        return "#94A3B8";
    }
  };

  const getPriorityStyle = (priority: string) => {
    const color = getPriorityColor(priority);
    return {
      backgroundColor: color,
      color: "#FFF",
    };
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`task-card ${isDragging ? "dragging" : ""}`}
      >
        {/* Task Actions Menu */}
        <div className="task-actions">
          <button
            className="task-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-label="Task actions"
          >
            <svg
              width="16"
              height="4"
              viewBox="0 0 18 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 0C8.60444 0 8.21776 0.117298 7.88886 0.337061C7.55996 0.556824 7.30362 0.869181 7.15224 1.23463C7.00087 1.60009 6.96126 2.00222 7.03843 2.39018C7.1156 2.77814 7.30608 3.13451 7.58579 3.41421C7.86549 3.69392 8.22186 3.8844 8.60982 3.96157C8.99778 4.03874 9.39992 3.99913 9.76537 3.84776C10.1308 3.69638 10.4432 3.44004 10.6629 3.11114C10.8827 2.78224 11 2.39556 11 2C11 1.46957 10.7893 0.96086 10.4142 0.585787C10.0391 0.210714 9.53043 0 9 0ZM2 0C1.60444 0 1.21776 0.117298 0.88886 0.337061C0.559962 0.556824 0.303617 0.869181 0.152242 1.23463C0.000866562 1.60009 -0.0387401 2.00222 0.0384303 2.39018C0.115601 2.77814 0.306082 3.13451 0.585787 3.41421C0.865492 3.69392 1.22186 3.8844 1.60982 3.96157C1.99778 4.03874 2.39992 3.99913 2.76537 3.84776C3.13082 3.69638 3.44318 3.44004 3.66294 3.11114C3.8827 2.78224 4 2.39556 4 2C4 1.46957 3.78929 0.96086 3.41421 0.585787C3.03914 0.210714 2.53043 0 2 0ZM16 0C15.6044 0 15.2178 0.117298 14.8889 0.337061C14.56 0.556824 14.3036 0.869181 14.1522 1.23463C14.0009 1.60009 13.9613 2.00222 14.0384 2.39018C14.1156 2.77814 14.3061 3.13451 14.5858 3.41421C14.8655 3.69392 15.2219 3.8844 15.6098 3.96157C15.9978 4.03874 16.3999 3.99913 16.7654 3.84776C17.1308 3.69638 17.4432 3.44004 17.6629 3.11114C17.8827 2.78224 18 2.39556 18 2C18 1.46957 17.7893 0.96086 17.4142 0.585787C17.0391 0.210714 16.5304 0 16 0Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="task-menu">
              <button onClick={handleEditClick} className="menu-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
              <button onClick={handleDeleteClick} className="menu-item delete">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Priority Tag */}
        <div className="task-priority" style={getPriorityStyle(task.priority)}>
          {task.priority}
        </div>

        {/* Cover Image */}
        {task.coverImage && (
          <div className="task-cover">
            <img src={task.coverImage} alt="" className="cover-image" />
          </div>
        )}

        {/* Task Content */}
        <div className="task-content">
          <h4 className="task-title">{task.title}</h4>
          {task.description && task.description !== "--" && (
            <p className="task-description">{task.description}</p>
          )}

          {/* Due Date */}
          {task.dueDate && task.dueDate !== "--" && (
            <div className="task-due-date">
              <span>{task.dueDate}</span>
            </div>
          )}

          {/* Task Footer */}
          <div className="task-footer">
            {/* Assignees */}
            {task.assignees && task.assignees.length > 0 && (
              <div className="task-assignees">
                {task.assignees.slice(0, 3).map((assignee, index) => (
                  <div
                    key={assignee.id}
                    className="assignee-avatar"
                    style={{ zIndex: 10 - index }}
                  >
                    <img src={assignee.avatar} alt={assignee.name} />
                  </div>
                ))}
                {task.assignees.length > 3 && (
                  <div className="assignee-more">
                    +{task.assignees.length - 3}
                  </div>
                )}
              </div>
            )}

            {/* Task Stats */}
            <div className="task-stats">
              {/* Progress */}
              {task.totalSubtasks && task.totalSubtasks > 0 && (
                <div className="task-progress">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 17 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.812 5.7715L7.1655 9.4265L5.763 8.024C5.6868 7.93502 5.59303 7.86275 5.48758 7.81173C5.38212 7.76071 5.26726 7.73204 5.1502 7.72752C5.03314 7.723 4.9164 7.74272 4.80733 7.78546C4.69825 7.82819 4.59919 7.89301 4.51635 7.97584C4.43351 8.05868 4.36869 8.15775 4.32596 8.26682C4.28323 8.3759 4.2635 8.49263 4.26802 8.60969C4.27255 8.72675 4.30122 8.84162 4.35224 8.94707C4.40326 9.05253 4.47552 9.1463 4.5645 9.2225L6.562 11.2285C6.64143 11.3073 6.73562 11.3696 6.83918 11.4119C6.94274 11.4542 7.05364 11.4756 7.1655 11.475C7.38849 11.4741 7.60218 11.3855 7.7605 11.2285L12.0105 6.9785C12.0902 6.89948 12.1534 6.80547 12.1966 6.70189C12.2397 6.59831 12.2619 6.48721 12.2619 6.375C12.2619 6.26279 12.2397 6.15169 12.1966 6.04811C12.1534 5.94453 12.0902 5.85052 12.0105 5.7715C11.8512 5.61319 11.6358 5.52432 11.4113 5.52432C11.1867 5.52432 10.9713 5.61319 10.812 5.7715ZM8.5 0C6.81886 0 5.17547 0.498516 3.77766 1.43251C2.37984 2.3665 1.29037 3.69402 0.647028 5.24719C0.00368291 6.80036 -0.164645 8.50943 0.163329 10.1583C0.491303 11.8071 1.30085 13.3217 2.4896 14.5104C3.67834 15.6992 5.1929 16.5087 6.84173 16.8367C8.49057 17.1646 10.1996 16.9963 11.7528 16.353C13.306 15.7096 14.6335 14.6202 15.5675 13.2223C16.5015 11.8245 17 10.1811 17 8.5C17 7.38376 16.7801 6.27846 16.353 5.24719C15.9258 4.21592 15.2997 3.27889 14.5104 2.48959C13.7211 1.70029 12.7841 1.07419 11.7528 0.647024C10.7215 0.219859 9.61624 0 8.5 0ZM8.5 15.3C7.15509 15.3 5.84038 14.9012 4.72212 14.154C3.60387 13.4068 2.7323 12.3448 2.21762 11.1022C1.70295 9.85971 1.56828 8.49245 1.83066 7.17338C2.09304 5.85431 2.74068 4.64267 3.69168 3.69167C4.64267 2.74068 5.85432 2.09304 7.17339 1.83066C8.49246 1.56828 9.85971 1.70294 11.1022 2.21762C12.3448 2.73229 13.4068 3.60387 14.154 4.72212C14.9012 5.84037 15.3 7.15509 15.3 8.5C15.3 10.3035 14.5836 12.0331 13.3083 13.3083C12.0331 14.5836 10.3035 15.3 8.5 15.3Z"
                      fill="#768396"
                    />
                  </svg>
                  <span className="progress-text">
                    {task.completedSubtasks || 0}/{task.totalSubtasks}
                  </span>
                </div>
              )}

              {/* Comments */}
              {task.comments && task.comments > 0 && (
                <div className="task-comments">
                  <svg
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.33333 0H1.66667C1.22464 0 0.800716 0.173839 0.488155 0.483273C0.175595 0.792708 0 1.21239 0 1.65V7.69999C0 8.1376 0.175595 8.55728 0.488155 8.86672C0.800716 9.17615 1.22464 9.34999 1.66667 9.34999H3.10556L4.60556 10.8405C4.65747 10.8915 4.71903 10.9318 4.78672 10.9592C4.85441 10.9865 4.92689 11.0004 5 11C5.13241 11 5.26048 10.9532 5.36111 10.868L7.15 9.34999H8.33333C8.77536 9.34999 9.19928 9.17615 9.51185 8.86672C9.82441 8.55728 10 8.1376 10 7.69999V1.65C10 1.21239 9.82441 0.792708 9.51185 0.483273C9.19928 0.173839 8.77536 0 8.33333 0ZM8.88889 7.69999C8.88889 7.84586 8.83036 7.98576 8.72617 8.0889C8.62198 8.19205 8.48068 8.24999 8.33333 8.24999H6.94444C6.81203 8.24998 6.68397 8.29679 6.58333 8.38199L5.02778 9.70199L3.72778 8.40949C3.67587 8.35852 3.6143 8.31819 3.54661 8.29082C3.47893 8.26345 3.40645 8.24957 3.33333 8.24999H1.66667C1.51932 8.24999 1.37802 8.19205 1.27383 8.0889C1.16964 7.98576 1.11111 7.84586 1.11111 7.69999V1.65C1.11111 1.50413 1.16964 1.36424 1.27383 1.26109C1.37802 1.15795 1.51932 1.1 1.66667 1.1H8.33333C8.48068 1.1 8.62198 1.15795 8.72617 1.26109C8.83036 1.36424 8.88889 1.50413 8.88889 1.65V7.69999Z"
                      fill="#768396"
                    />
                  </svg>
                  <span className="comments-text">{task.comments} Comment</span>
                </div>
              )}

              {/* Attachments */}
              {task.attachments && task.attachments > 0 && (
                <div className="task-attachments">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.01927 5.39016L2.45682 6.95262C2.26764 7.13519 2.015 7.23722 1.7521 7.23722C1.4892 7.23722 1.23655 7.13519 1.04738 6.95262C0.954603 6.86021 0.880985 6.75038 0.830753 6.62945C0.780521 6.50852 0.754663 6.37885 0.754663 6.2479C0.754663 6.11695 0.780521 5.98729 0.830753 5.86636C0.880985 5.74542 0.954603 5.6356 1.04738 5.54319L2.60984 3.98073C2.68567 3.9049 2.72827 3.80205 2.72827 3.69481C2.72827 3.58758 2.68567 3.48473 2.60984 3.4089C2.53401 3.33307 2.43116 3.29047 2.32393 3.29047C2.21669 3.29047 2.11384 3.33307 2.03801 3.4089L0.475555 4.97538C0.160791 5.318 -0.0094429 5.76896 0.000404603 6.23411C0.0102521 6.69926 0.199419 7.14262 0.528402 7.4716C0.857384 7.80058 1.30074 7.98975 1.76589 7.9996C2.23104 8.00944 2.682 7.83921 3.02462 7.52445L4.5911 5.96199C4.66693 5.88616 4.70953 5.78331 4.70953 5.67607C4.70953 5.56884 4.66693 5.46599 4.5911 5.39016C4.51527 5.31433 4.41242 5.27173 4.30519 5.27173C4.19795 5.27173 4.0951 5.31433 4.01927 5.39016ZM7.4744 0.525603C7.13564 0.188952 6.67745 0 6.19987 0C5.72228 0 5.26409 0.188952 4.92534 0.525603L3.35885 2.08806C3.32131 2.12561 3.29152 2.17018 3.2712 2.21924C3.25088 2.2683 3.24042 2.32087 3.24042 2.37397C3.24042 2.42707 3.25088 2.47965 3.2712 2.52871C3.29152 2.57777 3.32131 2.62234 3.35885 2.65989C3.3964 2.69743 3.44097 2.72722 3.49003 2.74754C3.53909 2.76786 3.59167 2.77832 3.64477 2.77832C3.69787 2.77832 3.75044 2.76786 3.7995 2.74754C3.84856 2.72722 3.89313 2.69743 3.93068 2.65989L5.49314 1.09743C5.68231 0.914858 5.93495 0.812828 6.19785 0.812828C6.46076 0.812828 6.7134 0.914858 6.90257 1.09743C6.99535 1.18984 7.06897 1.29967 7.1192 1.4206C7.16943 1.54153 7.19529 1.6712 7.19529 1.80215C7.19529 1.9331 7.16943 2.06276 7.1192 2.18369C7.06897 2.30463 6.99535 2.41445 6.90257 2.50686L5.34011 4.06932C5.30237 4.10676 5.27241 4.1513 5.25197 4.20037C5.23152 4.24944 5.221 4.30207 5.221 4.35523C5.221 4.40839 5.23152 4.46103 5.25197 4.5101C5.27241 4.55917 5.30237 4.60371 5.34011 4.64115C5.37755 4.67889 5.42209 4.70885 5.47116 4.72929C5.52023 4.74974 5.57287 4.76026 5.62603 4.76026C5.67919 4.76026 5.73182 4.74974 5.78089 4.72929C5.82997 4.70885 5.8745 4.67889 5.91194 4.64115L7.4744 3.07466C7.81105 2.73591 8 2.27772 8 1.80013C8 1.32255 7.81105 0.864358 7.4744 0.525603ZM2.69843 5.30157C2.73606 5.33889 2.78069 5.36842 2.82975 5.38846C2.87881 5.4085 2.93135 5.41866 2.98435 5.41835C3.03734 5.41866 3.08988 5.4085 3.13894 5.38846C3.18801 5.36842 3.23263 5.33889 3.27026 5.30157L5.25152 3.32031C5.32735 3.24448 5.36995 3.14163 5.36995 3.03439C5.36995 2.92716 5.32735 2.82431 5.25152 2.74848C5.17569 2.67265 5.07284 2.63005 4.96561 2.63005C4.85837 2.63005 4.75552 2.67265 4.67969 2.74848L2.69843 4.72974C2.66069 4.76718 2.63073 4.81172 2.61029 4.86079C2.58984 4.90986 2.57932 4.96249 2.57932 5.01565C2.57932 5.06881 2.58984 5.12145 2.61029 5.17052C2.63073 5.21959 2.66069 5.26413 2.69843 5.30157Z"
                      fill="#768396"
                    />
                  </svg>
                  <span className="attachments-text">
                    {task.attachments} file
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm
              editTask={task}
              onClose={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="delete-confirm">
              <h3>Delete Task</h3>
              <p>
                Are you sure you want to delete "{task.title}"? This action
                cannot be undone.
              </p>
              <div className="delete-actions">
                <button onClick={cancelDelete} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
