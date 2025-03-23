import { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import "./ObstacleCourse.css";
import sunsetImageUrl from "./assets/sunset.jpg";

const ObstacleCourse = () => {
  // State for loading quiz and spinner
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingQuiz, setShowLoadingQuiz] =
    useState(true);
  const [favoriteNumber, setFavoriteNumber] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackId] = useState(
    "nxzPZLvW02bQ4r4kSfeQwsYq6OwSx4tiH5f4IC1Uof01A"
  );

  const containerRef = useRef(null);
  const playerRef = useRef(null);

  // Handle loading quiz submission
  const handleQuizSubmit = (e) => {
    e.preventDefault();

    if (
      !favoriteNumber ||
      isNaN(favoriteNumber) ||
      favoriteNumber <= 0
    ) {
      alert("Please enter a positive number!");
      return;
    }

    // Convert to number and cap at 60 seconds
    const loadTime = Math.min(
      Math.floor(Number(favoriteNumber)),
      60
    );
    setLoadingTime(loadTime);
    setQuizSubmitted(true);

    // Start the loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 100 / loadTime;

      if (progress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setShowLoadingQuiz(false);

        // Attempt to play video after loading
        if (playerRef.current) {
          playerRef.current
            .play()
            .catch((e) =>
              console.log("Auto-play failed:", e)
            );
          setIsPlaying(true);
        }
      }

      setLoadingProgress(Math.min(progress, 100));
    }, 1000);
  };

  return (
    <div className="player-container" ref={containerRef}>
      {/* Mux Player React Component - using the format from the Mux dashboard React tab */}
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        metadataVideoTitle="Placeholder (optional)"
        metadata-viewer-user-id="Placeholder (optional)"
        primaryColor="#ffffff"
        secondaryColor="#000000"
        accentColor="#fa50b5"
        streamType="on-demand"
        // This will hide the Mux controls while our quiz overlay is showing
        controls={!showLoadingQuiz}
      />

      {showLoadingQuiz && (
        <div className="overlay">
          {!quizSubmitted ? (
            <div className="quiz-form">
              <h2>What's your favorite number?</h2>
              <input
                type="number"
                value={favoriteNumber}
                onChange={(e) =>
                  setFavoriteNumber(e.target.value)
                }
                min="1"
                max="60"
                placeholder="Enter a number (1-60)"
              />
              <button onClick={handleQuizSubmit}>
                Submit
              </button>
            </div>
          ) : (
            <div className="loading-screen">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p>{Math.floor(loadingProgress)}%</p>
              <img
                src={sunsetImageUrl}
                alt="Loading"
                className="spinner"
              />
              <button
                onClick={() =>
                  alert(
                    "Nice try! But we need more time..."
                  )
                }
                className="skip-button"
                onMouseEnter={(e) => {
                  e.target.style.transform = `translateX(${
                    Math.random() > 0.5 ? 100 : -100
                  }px)`;
                  setTimeout(() => {
                    e.target.style.transform =
                      "translateX(0)";
                  }, 800);
                }}
              >
                Skip
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ObstacleCourse;
