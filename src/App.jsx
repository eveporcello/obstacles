import React from "react";
import ObstacleCourse from "./ObstacleCourse";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Video</h1>
      </header>

      <div className="player-wrapper">
        <ObstacleCourse />
      </div>

      <footer>
        <p>{new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
