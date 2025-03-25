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

  // Theme selection state
  const [showThemeSelection, setShowThemeSelection] =
    useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [themeEffectActive, setThemeEffectActive] =
    useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  // TODO: Upload real video
  const [playbackId] = useState(
    "nxzPZLvW02bQ4r4kSfeQwsYq6OwSx4tiH5f4IC1Uof01A"
  );

  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const timeUpdateRef = useRef(null);
  const themeEffectTimerRef = useRef(null);

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

  // Handler for theme selection
  const handleThemeSelection = (theme) => {
    setSelectedTheme(theme);
    setShowThemeSelection(false);

    if (playerRef.current) {
      playerRef.current
        .play()
        .catch((e) => console.log("Resume failed:", e));
      setIsPlaying(true);
    }

    // Schedule random theme effects to appear
    scheduleThemeEffects();
  };

  // Schedule random theme effect appearances
  const scheduleThemeEffects = () => {
    const scheduleNextEffect = () => {
      const delay = Math.floor(Math.random() * 8000) + 3000; // Random delay between 3-11 seconds

      themeEffectTimerRef.current = setTimeout(() => {
        // Activate effect
        setThemeEffectActive(true);

        // Deactivate after a random duration
        const duration =
          Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
        setTimeout(() => {
          setThemeEffectActive(false);

          // Schedule next effect
          scheduleNextEffect();
        }, duration);
      }, delay);
    };

    // Start the chain
    scheduleNextEffect();
  };

  useEffect(() => {
    if (
      videoStarted &&
      isPlaying &&
      !showInterruption &&
      !showThemeSelection
    ) {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }

      timeUpdateRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime =
            playerRef.current.currentTime || 0;
          setVideoCurrentTime(currentTime);

          // First interruption - AI Assistant
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

          // Second interruption - Theme Selection
          if (
            currentTime >= 8 && // Show at 8 seconds
            !showThemeSelection &&
            interruptionAttempts > 0 && // Only after AI assistant
            !selectedTheme // Only if they haven't selected yet
          ) {
            playerRef.current.pause();
            setIsPlaying(false);
            setShowThemeSelection(true);
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
  }, [
    videoStarted,
    isPlaying,
    showInterruption,
    showThemeSelection,
    interruptionAttempts,
    selectedTheme
  ]);

  // Cleanup theme effect timers on unmount
  useEffect(() => {
    return () => {
      if (themeEffectTimerRef.current) {
        clearTimeout(themeEffectTimerRef.current);
      }
    };
  }, []);

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
          !showInterruption &&
          !showThemeSelection
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      ></MuxPlayer>

      {/* Theme effect overlays */}
      {selectedTheme && themeEffectActive && (
        <div className={`theme-effect ${selectedTheme}`}>
          {selectedTheme === "hot-lava" && (
            <div className="lava-flow"></div>
          )}
          {selectedTheme === "rock-slide" && (
            <div className="falling-rocks">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rock"
                  style={{
                    left: `${Math.random() * 90}%`,
                    animationDuration: `${
                      Math.random() * 2 + 1
                    }s`,
                    animationDelay: `${
                      Math.random() * 0.5
                    }s`
                  }}
                ></div>
              ))}
            </div>
          )}
          {selectedTheme === "slime" && (
            <div className="slime-drip">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="slime-drop"
                  style={{
                    left: `${Math.random() * 90}%`,
                    animationDuration: `${
                      Math.random() * 3 + 2
                    }s`,
                    animationDelay: `${
                      Math.random() * 0.8
                    }s`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      )}

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

      {/* Theme Selection Overlay */}
      {showThemeSelection && (
        <div className="overlay theme-selection-overlay">
          <div className="theme-selection-dialog">
            <h2>Choose Your Obstacle Course Theme</h2>
            <p>Pick your challenge. No going back!</p>

            <div className="theme-options">
              <div
                className="theme-option hot-lava"
                onClick={() =>
                  handleThemeSelection("hot-lava")
                }
              >
                <div className="theme-preview lava-preview"></div>
                <h3>HOT LAVA</h3>
                <p>Watch out for unexpected eruptions!</p>
              </div>

              <div
                className="theme-option rock-slide"
                onClick={() =>
                  handleThemeSelection("rock-slide")
                }
              >
                <div className="theme-preview rock-preview"></div>
                <h3>ROCK SLIDE</h3>
                <p>Boulders may block your view!</p>
              </div>

              <div
                className="theme-option slime"
                onClick={() =>
                  handleThemeSelection("slime")
                }
              >
                <div className="theme-preview slime-preview"></div>
                <h3>SLIME</h3>
                <p>
                  It's sticky, gooey, and hard to see
                  through!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObstacleCourse;
