import React from "react";
import "./ViewSwitcher.css";

interface ViewSwitcherProps {
  view: "list" | "board";
  setView: (view: "list" | "board") => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ view, setView }) => {
  return (
    <div className="view-switcher">
      <button
        className={`view-button ${view === "list" ? "active" : ""}`}
        onClick={() => setView("list")}
        aria-label="Switch to List View"
        title="List View"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>

      <button
        className={`view-button ${view === "board" ? "active" : ""}`}
        onClick={() => setView("board")}
        aria-label="Switch to Board View"
        title="Board View"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      </button>
    </div>
  );
};

export default ViewSwitcher;
