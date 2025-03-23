import React from "react";
import ObstacleCourse from "./ObstacleCourse";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>VIDEO PLAYER CHALLENGE</h1>
        <p>Wait for it...</p>
      </header>

      <div className="player-wrapper">
        <ObstacleCourse />
      </div>

      <footer>
        <p>
          Created for the Mux Video Challenge &copy;{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}

export default App;
