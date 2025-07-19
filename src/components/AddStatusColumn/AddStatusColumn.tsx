import React, { useState } from "react";
import "./AddStatusColumn.css";

interface AddStatusColumnProps {
  onAddStatus: (statusName: string) => void;
}

const AddStatusColumn: React.FC<AddStatusColumnProps> = ({ onAddStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [statusName, setStatusName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (statusName.trim()) {
      onAddStatus(statusName.trim());
      setStatusName("");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setStatusName("");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="add-status-column editing">
        <form onSubmit={handleSubmit} className="add-status-form">
          <input
            type="text"
            value={statusName}
            onChange={(e) => setStatusName(e.target.value)}
            placeholder="Enter status name..."
            className="status-name-input"
            autoFocus
            maxLength={30}
          />
          <div className="form-actions">
            <button
              type="submit"
              className="save-btn"
              disabled={!statusName.trim()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="add-status-column" onClick={() => setIsEditing(true)}>
      <div className="add-status-content">
        <div className="add-icon-large">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <span className="add-status-text">Add Status</span>
      </div>
    </div>
  );
};

export default AddStatusColumn;
