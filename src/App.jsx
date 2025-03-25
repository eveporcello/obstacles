import React from "react";
import ObstacleCourse from "./ObstacleCourse";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Legends of the Hidden MUX Video Player</h1>
      </header>

      <div className="player-wrapper">
        <ObstacleCourse />
      </div>
    </div>
  );
}

export default App;
