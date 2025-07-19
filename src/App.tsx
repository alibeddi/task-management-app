import React from "react";
import "./App.css";
import BoardView from "./components/BoardView/BoardView";
import Header from "./components/Header/Header";
import { useState } from "react";
import { ListView } from "./components/ListView";

function App() {
  const [view, setView] = useState<"list" | "board">("board");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="app-container">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="main-wrapper">
        {view === "list" ? (
          <ListView view={view} setView={setView} searchQuery={searchQuery} />
        ) : (
          <BoardView view={view} setView={setView} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}

export default App;
