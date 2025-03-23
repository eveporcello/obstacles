import { useState, useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import "./ObstacleCourse.css";
import sunsetImageUrl from "./assets/sunset.jpg";
// Import the wagging finger GIF/video
// Replace this path with the actual path to your GIF/video
import waggingFingerGif from "./assets/wagging-finger.gif";
import PlayButtonObstacle from "./PlayButtonObstacle";
import "./PlayButtonObstacle.css";

const ObstacleCourse = () => {
  // State for loading quiz and spinner
  const [isLoading, setIsLoading] = useState(true);
  const [showLoadingQuiz, setShowLoadingQuiz] =
    useState(true);
  const [favoriteNumber, setFavoriteNumber] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // State for confirmation overlays
  const [showConfirmation, setShowConfirmation] =
    useState(false);
  const [confirmationAttempts, setConfirmationAttempts] =
    useState(0);

  // State for video interruption
  const [showInterruption, setShowInterruption] =
    useState(false);
  const [interruptionAttempts, setInterruptionAttempts] =
    useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const [videoTime, setVideoTime] = useState(0);

  // State for control manipulation
  const [manipulatedControls, setManipulatedControls] =
    useState(false);
  const [controlsFlipped, setControlsFlipped] =
    useState(false);
  const [videoFlipped, setVideoFlipped] = useState(false);

  // State for play button obstacle
  const [
    showPlayButtonObstacle,
    setShowPlayButtonObstacle
  ] = useState(false);
  const [
    playButtonWrongAttempts,
    setPlayButtonWrongAttempts
  ] = useState(0);
  const [videoPausedManually, setVideoPausedManually] =
    useState(false);

  // Video player state
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

        // Show confirmation instead of playing video immediately
        setShowConfirmation(true);
      }

      setLoadingProgress(Math.min(progress, 100));
    }, 1000);
  };

  // Handle confirmation dialog
  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      // If they're "sure", increase attempt count and make it harder
      setConfirmationAttempts((prev) => prev + 1);

      // Only allow after 3 attempts
      if (confirmationAttempts >= 2) {
        setShowConfirmation(false);

        // Play the video
        if (playerRef.current) {
          playerRef.current
            .play()
            .catch((e) =>
              console.log("Auto-play failed:", e)
            );
          setVideoStarted(true);
        }
      } else {
        // Show them a different message for each attempt
        const messages = [
          "Are you REALLY sure? This video might change your life...",
          "This is your LAST chance. Are you ABSOLUTELY certain?"
        ];
        alert(messages[confirmationAttempts]);
      }
    } else {
      // If they say no, guilt trip them
      alert(
        "Oh come on! You've waited this long already. Try again."
      );
    }
  };

  // Handle interruption dialog
  const handleInterruption = (continue_) => {
    if (continue_) {
      // If they choose to continue, increase attempt count
      setInterruptionAttempts((prev) => prev + 1);

      // Only allow after 2 attempts
      if (interruptionAttempts >= 1) {
        setShowInterruption(false);

        // Resume the video
        if (playerRef.current) {
          playerRef.current
            .play()
            .catch((e) => console.log("Resume failed:", e));

          // After they've gone through all these obstacles, start messing with controls
          // Schedule control manipulation to happen 5 seconds after video resumes
          setTimeout(() => {
            manipulateControls();
          }, 5000);
        }
      } else {
        // Show another message
        alert(
          "Are you absolutely certain? This video contains... content."
        );
      }
    } else {
      // If they say no, express relief
      alert(
        "Good choice! But we're going to play it anyway..."
      );
      setShowInterruption(false);

      // Resume the video after a short delay
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current
            .play()
            .catch((e) => console.log("Resume failed:", e));

          // Schedule control manipulation
          setTimeout(() => {
            manipulateControls();
          }, 5000);
        }
      }, 1500);
    }
  };

  // Handlers for play button obstacle
  const handleCorrectPlayButtonClick = () => {
    setShowPlayButtonObstacle(false);

    // Resume playback
    if (playerRef.current) {
      playerRef.current
        .play()
        .catch((e) => console.log("Resume failed:", e));
    }

    // Reset for next time
    setPlayButtonWrongAttempts(0);
    setVideoPausedManually(false);
  };

  const handleWrongPlayButtonClick = (attempts) => {
    setPlayButtonWrongAttempts((prev) => prev + 1);

    // After several wrong attempts, make it even more annoying
    if (attempts > 5) {
      // Resize a random number of buttons to be extremely small
      const buttons =
        document.querySelectorAll(".play-button");
      buttons.forEach((button) => {
        if (Math.random() > 0.7) {
          button.style.transform = "scale(0.2)";
        }
      });

      // Add a taunting message
      alert(
        "Having trouble finding the right button? Keep trying!"
      );
    }
  };

  // Manipulate the Mux player controls
  const manipulateControls = () => {
    setManipulatedControls(true);

    // 1. Flip the controls horizontally
    setControlsFlipped(true);

    // Find and manipulate the Mux player controls directly
    const manipulateControlBar = () => {
      // Get mux-player element and its shadow DOM elements
      const muxPlayer = playerRef.current;

      if (muxPlayer) {
        try {
          // Try to access the control bar via shadow DOM
          const controlBar = document
            .querySelector("mux-player")
            ?.shadowRoot?.querySelector(
              "media-control-bar"
            );

          if (controlBar) {
            // Flip controls horizontally
            controlBar.style.flexDirection = "row-reverse";

            // Make other random modifications
            const buttons =
              controlBar.querySelectorAll("button");
            if (buttons.length) {
              // Make buttons do random things
              buttons.forEach((button) => {
                // Random chance to rotate them
                if (Math.random() > 0.5) {
                  button.style.transform = `rotate(${Math.floor(
                    Math.random() * 360
                  )}deg)`;
                }

                // Add wonky hover effect
                button.addEventListener(
                  "mouseenter",
                  (e) => {
                    const randomX = Math.random() * 20 - 10;
                    const randomY = Math.random() * 20 - 10;
                    e.target.style.transform = `translate(${randomX}px, ${randomY}px)`;
                  }
                );

                button.addEventListener(
                  "mouseleave",
                  (e) => {
                    e.target.style.transform = "";
                  }
                );
              });
            }

            // Add more bizarre behavior
            setTimeout(() => {
              // Flip the video (not just controls)
              setVideoFlipped(true);

              setTimeout(() => {
                // Unflip after 3 seconds
                setVideoFlipped(false);
              }, 3000);
            }, 3000);
          }
        } catch (error) {
          console.log(
            "Error manipulating controls:",
            error
          );
        }
      }
    };

    // Try to manipulate controls - may need to retry if shadow DOM isn't ready
    manipulateControlBar();

    // Set a backup to try again
    setTimeout(manipulateControlBar, 500);
  };

  // Set up time update handler to track video time and trigger interruption
  const handleTimeUpdate = () => {
    if (playerRef.current) {
      const time = playerRef.current.currentTime;
      setVideoTime(time);

      // If video has played for 3 seconds and interruption hasn't been shown
      if (
        time >= 3 &&
        !showInterruption &&
        videoStarted &&
        interruptionAttempts === 0
      ) {
        console.log(
          "Triggering interruption at time:",
          time
        );

        // Pause the video
        playerRef.current.pause();

        // Show interruption overlay
        setShowInterruption(true);
      }
    }
  };

  // Handle video pause/play events
  const handlePause = () => {
    // Only show play button obstacle if video has started and we're past the initial interruptions
    if (
      videoStarted &&
      !showInterruption &&
      !showConfirmation &&
      !showLoadingQuiz
    ) {
      console.log("Video paused manually");
      setVideoPausedManually(true);

      // Small delay to ensure it wasn't a system pause
      setTimeout(() => {
        if (playerRef.current && playerRef.current.paused) {
          setShowPlayButtonObstacle(true);
        }
      }, 300);
    }
  };

  const handlePlay = () => {
    setShowPlayButtonObstacle(false);
    setVideoPausedManually(false);
  };

  return (
    <div className="player-container" ref={containerRef}>
      {/* Mux Player React Component */}
      <div
        className={`mux-player-wrapper ${
          controlsFlipped ? "controls-flipped" : ""
        } ${videoFlipped ? "video-flipped" : ""}`}
      >
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
            !showPlayButtonObstacle
          }
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => {
            console.log("Video played!");
            if (
              !videoStarted &&
              !showLoadingQuiz &&
              !showConfirmation
            ) {
              setVideoStarted(true);
            }
            handlePlay();
          }}
          onPause={handlePause}
        />
      </div>

      {/* Loading Quiz Overlay */}
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

      {/* Initial Confirmation Overlay */}
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
              Your friend doesn't think this is a good
              idea...
            </p>

            <div className="confirmation-buttons">
              <button
                onClick={() => handleConfirmation(true)}
                className="yes-button"
                onMouseEnter={(e) => {
                  // Button runs away when hovered, but only sometimes to be extra annoying
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

      {/* Video Interruption Overlay after 3 seconds */}
      {showInterruption && (
        <div className="overlay interruption-overlay">
          <div className="interruption-dialog">
            <h2>WAIT! STOP THE VIDEO!</h2>

            <div className="wagging-finger-container shaking">
              <img
                src={waggingFingerGif}
                alt="No no no!"
                className="wagging-finger"
              />
            </div>

            <p>
              Your friend REALLY thinks you shouldn't watch
              this.
            </p>
            <p className="warning-text">
              Are you absolutely certain you want to
              continue?
            </p>

            <div className="confirmation-buttons">
              <button
                onClick={() => handleInterruption(true)}
                className="yes-button"
                onMouseEnter={(e) => {
                  // Button runs away when hovered, but make it even harder
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
                Continue Anyway
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

      {/* Play Button Obstacle */}
      <PlayButtonObstacle
        isVisible={showPlayButtonObstacle}
        onCorrectButtonClick={handleCorrectPlayButtonClick}
        onWrongButtonClick={handleWrongPlayButtonClick}
      />

      {/* Optional debug time display */}
      {/* <div className="time-display">
        Video time: {videoTime.toFixed(1)}s | Started: {videoStarted ? "Yes" : "No"}
      </div> */}
    </div>
  );
};

export default ObstacleCourse;
