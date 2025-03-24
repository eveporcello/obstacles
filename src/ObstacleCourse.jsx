import { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import "./ObstacleCourse.css";
// TODO: Import Real Gif
import sunsetImageUrl from "./assets/sunset.jpg";
// TODO: Import Real Gif
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

  // TODO: Upload real video
  const [playbackId] = useState(
    "nxzPZLvW02bQ4r4kSfeQwsYq6OwSx4tiH5f4IC1Uof01A"
  );

  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const timeUpdateRef = useRef(null);

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

    let progress = 0;
    const interval = setInterval(() => {
      progress += 100 / loadTime;

      if (progress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setShowLoadingQuiz(false);
        setShowConfirmation(true);
      }

      setLoadingProgress(Math.min(progress, 100));
    }, 1000);
  };

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      setConfirmationAttempts((prev) => prev + 1);

      // Only allow after 3 attempts
      if (confirmationAttempts >= 2) {
        setShowConfirmation(false);

        if (playerRef.current) {
          playerRef.current
            .play()
            .catch((e) =>
              console.log("Auto-play failed:", e)
            );
          setIsPlaying(true);
          setVideoStarted(true);
        }
      } else {
        // TODO: Update?
        const messages = [
          "Before you can be sure, make sure you're sure.",
          "This is your LAST chance. Are you ABSOLUTELY certain?"
        ];
        alert(messages[confirmationAttempts]);
      }
    } else {
      alert("Be more fun! Embrace the process.");
    }
  };

  const handleInterruption = (continue_) => {
    if (continue_) {
      setInterruptionAttempts((prev) => prev + 1);
      if (interruptionAttempts >= 1) {
        setShowInterruption(false);

        if (playerRef.current) {
          playerRef.current
            .play()
            .catch((e) => console.log("Resume failed:", e));
          setIsPlaying(true);
        }
      } else {
        alert("Be sure.");
      }
    } else {
      alert(
        "Good choice! But we're going to play it anyway..."
      );
      setShowInterruption(false);
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current
            .play()
            .catch((e) => console.log("Resume failed:", e));
          setIsPlaying(true);
        }
      }, 1500);
    }
  };

  useEffect(() => {
    if (videoStarted && isPlaying && !showInterruption) {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }

      timeUpdateRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime =
            playerRef.current.currentTime || 0;
          setVideoCurrentTime(currentTime);

          if (
            currentTime >= 3 &&
            !showInterruption &&
            interruptionAttempts === 0
          ) {
            playerRef.current.pause();
            setIsPlaying(false);

            setShowInterruption(true);
            clearInterval(timeUpdateRef.current);
          }
        }
      }, 100);

      return () => {
        if (timeUpdateRef.current) {
          clearInterval(timeUpdateRef.current);
        }
      };
    }
  }, [videoStarted, isPlaying, showInterruption]);

  return (
    <div className="player-container" ref={containerRef}>
      <MuxPlayer
        ref={playerRef}
        playbackId={playbackId}
        metadataVideoTitle="Placeholder (optional)"
        metadata={{
          viewer_user_id: "Placeholder (optional)"
        }}
        primaryColor="#ffffff"
        secondaryColor="#000000"
        accentColor="#fa50b5"
        streamType="on-demand"
        controls={
          !showLoadingQuiz &&
          !showConfirmation &&
          !showInterruption
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
                <p>
                  Great! Then you will love to wait{" "}
                  {favoriteNumber} seconds.
                </p>
              </div>
              <p>{Math.floor(loadingProgress)}%</p>
              <img
                src={sunsetImageUrl}
                alt="Loading"
                className="spinner"
              />
              <button
                onClick={() => alert("Not yet. Relax.")}
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

      {showConfirmation && (
        <div className="overlay">
          <div className="confirmation-dialog">
            <h2>Are you sure you want to watch this?</h2>

            <div className="wagging-finger-container">
              <img
                src={waggingFingerGif}
                alt="No no no!"
                className="wagging-finger"
              />
            </div>

            <p>
              We want to make sure you want to watch this.
            </p>

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
        <div className="overlay interruption-overlay">
          <div className="interruption-dialog">
            <div className="wagging-finger-container shaking">
              <img
                src={waggingFingerGif}
                alt="No no no!"
                className="wagging-finger"
              />
            </div>
            <p className="warning-text">
              Have you considered using our AI Assistant?
            </p>

            <div className="confirmation-buttons">
              <button
                onClick={() => handleInterruption(true)}
                className="yes-button"
                onMouseEnter={(e) => {
                  if (Math.random() > 0.2) {
                    const xOffset =
                      Math.random() > 0.5 ? 150 : -150;
                    const yOffset =
                      Math.random() > 0.5 ? -70 : 30;
                    e.target.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
                    setTimeout(() => {
                      e.target.style.transform =
                        "translateX(0)";
                    }, 1000);
                  }
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleInterruption(false)}
                className="no-button"
              >
                Stop Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObstacleCourse;
