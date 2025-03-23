import React, { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import "./ObstacleCourse.css";

// Using a public image URL for the spinner
const sunsetImageUrl =
  "https://images.unsplash.com/photo-1573591173361-99696ce5e0a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80";

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
    "a4nOgmxGWg6gULfcBbAa00gXyfcwPnAFldF8RdsNyk8M"
  );

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
      }

      setLoadingProgress(Math.min(progress, 100));
    }, 1000);
  };

  // Play/pause video functions
  const playVideo = () => {
    if (playerRef.current && !isLoading) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="player-container">
      {/* Mux Player */}
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        streamType="on-demand"
        metadata={{
          video_title: "Video Player",
          viewer_user_id: "user-123"
        }}
        paused={true} // Always paused initially
        autoPlay={false}
        controls={!showLoadingQuiz} // Only show controls after quiz
      />

      {/* Quiz Overlay */}
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
                  alert("Nice try! But you need to wait...")
                }
                className="skip-button"
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
