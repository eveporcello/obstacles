import { useState, useEffect, useRef } from "react";
import "media-chrome";
import { MediaProvider } from "media-chrome/react/media-store";
import Player from "./Player";
import "./ObstacleCourse.css";
import jasonHead from "./assets/jason-spinny-head.png";
import waggingFingerGif from "./assets/wagging-finger.gif";

const ObstacleCourse = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingQuiz, setShowLoadingQuiz] =
    useState(true);
  const [favoriteNumber, setFavoriteNumber] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] =
    useState(false);
  const [confirmationAttempts, setConfirmationAttempts] =
    useState(0);
  const [showInterruption, setShowInterruption] =
    useState(false);
  const [interruptionAttempts, setInterruptionAttempts] =
    useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] =
    useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef(null);
  const timeUpdateRef = useRef(null);

  const getVideoElement = () => {
    return document.querySelector("video");
  };

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
    const loadTime = Math.min(
      Math.floor(Number(favoriteNumber)),
      60
    );
    setLoadingTime(loadTime);
    setQuizSubmitted(true);

    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      setConfirmationAttempts((prev) => prev + 1);
      if (confirmationAttempts >= 2) {
        setShowConfirmation(false);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 100 / loadingTime;
          if (progress >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            setShowLoadingQuiz(false);
            const videoEl = getVideoElement();
            if (videoEl) {
              videoEl
                .play()
                .catch((e) =>
                  console.log("Auto-play failed:", e)
                );
              setIsPlaying(true);
              setVideoStarted(true);
            }
          }
          setLoadingProgress(Math.min(progress, 100));
        }, 1000);
      } else {
        const messages = [
          "Before you can be sure, make sure you're sure.",
          "This is your LAST chance. Are you ABSOLUTELY sure?"
        ];
        alert(messages[confirmationAttempts]);
      }
    } else {
      alert("Be more fun! Embrace the process.");
    }
  };

  const handleInterruption = (continue_) => {
    setInterruptionAttempts((prev) => prev + 1);
    setShowInterruption(false);
    const videoEl = getVideoElement();

    if (continue_) {
      videoEl &&
        videoEl
          .play()
          .catch((e) => console.log("Resume failed:", e));
      setIsPlaying(true);
    } else {
      alert(
        "Good choice! But we're going to play it anyway..."
      );
      setTimeout(() => {
        videoEl &&
          videoEl
            .play()
            .catch((e) => console.log("Resume failed:", e));
        setIsPlaying(true);
      }, 1500);
    }
  };

  // Set up time monitoring for video interruptions
  useEffect(() => {
    if (videoStarted && isPlaying && !showInterruption) {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }

      timeUpdateRef.current = setInterval(() => {
        const videoEl = getVideoElement();
        if (videoEl) {
          const currentTime = videoEl.currentTime || 0;
          setVideoCurrentTime(currentTime);
          if (
            currentTime >= 3 &&
            currentTime < 4 &&
            !showInterruption &&
            interruptionAttempts === 0
          ) {
            videoEl.pause();
            setIsPlaying(false);
            setShowInterruption(true);
          }
        }
      }, 100);

      return () => {
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current);
        }
      };
    }
  }, [
    videoStarted,
    isPlaying,
    showInterruption,
    interruptionAttempts
  ]);

  return (
    <MediaProvider>
      <div className="player-container">
        <Player />

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
            ) : !showConfirmation ? (
              <div className="loading-screen">
                <p>
                  Remember you said your favorite number was{" "}
                  {favoriteNumber}? Wait {favoriteNumber}{" "}
                  seconds.
                </p>
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p>{Math.floor(loadingProgress)}%</p>
                <img
                  src={jasonHead}
                  alt="Loading"
                  className="spinner"
                />
                <button
                  className="skip-button"
                  onClick={() => alert("Not yet. Relax.")}
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
            ) : null}
          </div>
        )}

        {showConfirmation && (
          <div className="overlay">
            <div className="confirmation-dialog">
              <h2>ah, ah, ah</h2>
              <div className="wagging-finger-container">
                <img
                  src={waggingFingerGif}
                  alt="No no no!"
                  className="wagging-finger"
                />
              </div>
              <p>Are you sure you want to watch this?</p>
              <div className="confirmation-buttons">
                <button
                  onClick={() => handleConfirmation(true)}
                  className="yes-button"
                  onMouseEnter={(e) => {
                    if (Math.random() > 0.3) {
                      const xOffset =
                        Math.random() > 0.5 ? 100 : -100;
                      const yOffset =
                        Math.random() > 0.5 ? -50 : 0;
                      e.target.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                      setTimeout(() => {
                        e.target.style.transform =
                          "translateX(0)";
                      }, 800);
                    }
                  }}
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => handleConfirmation(false)}
                  className="no-button"
                >
                  No, take me back
                </button>
              </div>
            </div>
          </div>
        )}

        {showInterruption && (
          <div className="overlay">
            <div className="interruption-dialog">
              <h2>Wait! Hold on!</h2>
              <p>
                Do you really want to continue watching this
                video?
              </p>
              <div className="interruption-buttons">
                <button
                  onClick={() => handleInterruption(true)}
                >
                  Yes, continue
                </button>
                <button
                  onClick={() => handleInterruption(false)}
                >
                  No, stop playing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MediaProvider>
  );
};

export default ObstacleCourse;
