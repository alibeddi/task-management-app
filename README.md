# Task Management App

A simple and modern task management app built with React and Redux.

---

## 🚀 How to Run the Project Locally

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   This will open the app in your browser at [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Project Architecture

- **React** for building the user interface.
- **Redux** for state management (tasks, statuses, filters).
- **Component-based structure:**
  - `components/` contains all UI parts (TaskCard, ListView, BoardView, Modals, etc.)
  - `redux/` contains state logic (slices for tasks and statuses)
  - `types/` for TypeScript type definitions
- **Drag and Drop:** Uses `@dnd-kit` for moving tasks between columns.
- **Responsive Design:** Works on desktop and mobile screens.
- **CSS Modules:** Each component has its own CSS for easy styling and maintenance.

### Main Features
- Board view (Kanban-style columns)
- List view (table-style tasks)
- Add, edit, delete tasks and statuses
- Drag and drop tasks between statuses
- Filter and sort tasks
- Responsive modals for task and status creation

---

## 🌐 Live Demo

- [Live Demo Link](https://your-demo-link.com) <!-- Replace with your actual link -->

---

## 📄 Notes
- This project is for learning and demo purposes.
- Feel free to fork and customize!
