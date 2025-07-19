import React from "react";
import "./App.css";
import BoardView from "./components/BoardView/BoardView";
import Header from "./components/Header/Header";
import { useState } from "react";
import { ListView } from "./components/ListView";

function App() {
  const [view, setView] = useState<"list" | "board">("list");
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: "#f6f8fa",
        display: "flex",
        flexDirection: "column",
      }}>
      <Header />
      {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '32px 0 24px 0' }}>
        
        <h2 style={{ margin: 0, fontWeight: 700, color: '#232360', fontSize: 28 }}>
          {view === 'list' ? 'List View' : 'Board View'}
        </h2>
      </div> */}
      <div style={{ flex: 1, overflowY: "auto", width: "100%" }}>
        {view === "list" ? (
          <ListView view={view} setView={setView} />
        ) : (
          <BoardView view={view} setView={setView} />
        )}
      </div>
    </div>
  );
}

export default App;
