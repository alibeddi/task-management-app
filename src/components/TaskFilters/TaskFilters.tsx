import React, { useState, useRef, useEffect } from "react";
import { StatusColumn } from "../../types/status";
import "./TaskFilters.css";

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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const hasActiveFilters =
    priorityFilter !== "all" || statusFilter !== "all" || dueDateFilter !== "";

  const clearAllFilters = () => {
    setPriorityFilter("all");
    setStatusFilter("all");
    setDueDateFilter("");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="filters-container">
      <button
        ref={buttonRef}
        className={`filters-button ${hasActiveFilters ? "has-filters" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open filters"
        aria-expanded={isOpen}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        Filters
        {hasActiveFilters && <span className="filter-badge"></span>}
      </button>

      {isOpen && (
        <div ref={dropdownRef} className="filters-dropdown">
          <div className="filters-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button
                className="clear-all-btn"
                onClick={clearAllFilters}
                aria-label="Clear all filters"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="filters-content">
            <div className="filter-group">
              <label htmlFor="priority-filter" className="filter-label">
                Priority
              </label>
              <select
                id="priority-filter"
                className="filter-select"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="status-filter" className="filter-label">
                Status
              </label>
              <select
                id="status-filter"
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="date-filter" className="filter-label">
                Due Before
              </label>
              <input
                id="date-filter"
                className="filter-input"
                type="date"
                value={dueDateFilter}
                onChange={(e) => setDueDateFilter(e.target.value)}
                placeholder="Select date"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;
