import React, { useState } from "react";
import "./StatusForm.css";
interface StatusFormProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  submitLabel?: string;
}

const StatusForm: React.FC<StatusFormProps> = ({ onClose, onSubmit, initialName = "", submitLabel = "Create Status" }) => {
  const [name, setName] = useState(initialName);

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{submitLabel === "Create Status" ? "Create New Status" : "Edit Status"}</h2>
        <button type="button" onClick={onClose} className="close-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          onSubmit(name.trim());
        }}
        className="task-form">
        <div className="form-group">
          <label htmlFor="statusName">Status Name *</label>
          <input
            type="text"
            id="statusName"
            name="statusName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter status name..."
            required
            autoFocus
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="create-btn">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusForm;
