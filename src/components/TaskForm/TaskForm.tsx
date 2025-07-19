import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "../../redux/tasksSlice";
import { RootState } from "../../redux/store";
import { Task, TaskCategory, Priority } from "../../types/task";
import "./TaskForm.css";

interface TaskFormProps {
  onClose: () => void;
  initialStatus?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onClose,
  initialStatus = "backlog",
}) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const statuses = useSelector((state: RootState) => state.statuses.statuses);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium" as Priority,
    category: "Design" as TaskCategory,
    status: initialStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }

    const tasksInStatus = tasks.filter(
      (task) => task.status === formData.status
    );
    const newOrder = tasksInStatus.length;

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData?.description || "--",
      dueDate: formData?.dueDate || "--",
      priority: formData.priority,
      status: formData.status,
      order: newOrder,
      category: formData.category,
      completedSubtasks: 0,
      totalSubtasks: 0,
    };

    dispatch(addTask(newTask));
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>Create New Task</h2>
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

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}>
              <option value="Design">Design</option>
              <option value="Content">Content</option>
              <option value="Research">Research</option>
              <option value="Planning">Planning</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="create-btn">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
