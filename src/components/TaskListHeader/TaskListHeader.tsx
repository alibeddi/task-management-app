import React from "react";
import "./TaskListHeader.css";

export type SortField = "title" | "dueDate" | "priority" | null;

interface TaskListHeaderProps {
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSort: (field: SortField) => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = ({
  sortField,
  sortDirection,
  onSort,
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return "↕";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className="task-list-header">
      <div className="header-cell title-desc" onClick={() => onSort("title")}>
        Title {renderSortIcon("title")}
      </div>
      <div className="header-cell due-date" onClick={() => onSort("dueDate")}>
        Due Date {renderSortIcon("dueDate")}
      </div>
      <div className="header-cell priority" onClick={() => onSort("priority")}>
        Priority {renderSortIcon("priority")}
      </div>
      <div className="header-cell actions">
        Actions
      </div>
    </div>
  );
};

export default TaskListHeader;
