import "./App.css";
import {
  MediaProvider,
  useMediaDispatch,
  useMediaFullscreenRef,
  useMediaRef,
  useMediaSelector,
  MediaActionTypes
} from "media-chrome/react/media-store";
import "@mux/mux-video";

const PlayButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPaused = useMediaSelector(
    (state) => state.mediaPaused
  );
  return (
    <button
      style={{ cursor: "pointer" }}
      onClick={() => {
        const type = mediaPaused
          ? MediaActionTypes.MEDIA_PLAY_REQUEST
          : MediaActionTypes.MEDIA_PAUSE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPaused ? "Play" : "Pause"}
    </button>
  );
};

const PlaybackRateButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPlaybackRate = useMediaSelector(
    (state) => state.mediaPlaybackRate
  );
  return (
    <button
      style={{ cursor: "pointer" }}
      onClick={() => {
        const type =
          MediaActionTypes.MEDIA_PLAYBACK_RATE_REQUEST;
        const detail = mediaPlaybackRate === 1 ? 2 : 1;
        dispatch({ type, detail });
      }}
    >
      {mediaPlaybackRate}x
    </button>
  );
};

const MuteButton = () => {
  const dispatch = useMediaDispatch();
  const mediaPseudoMuted = useMediaSelector(
    (state) => state.mediaVolumeLevel === "off"
  );
  return (
    <button
      style={{ cursor: "pointer" }}
      onClick={() => {
        const type = mediaPseudoMuted
          ? MediaActionTypes.MEDIA_UNMUTE_REQUEST
          : MediaActionTypes.MEDIA_MUTE_REQUEST;
        dispatch({ type });
      }}
    >
      {mediaPseudoMuted ? "Unmute" : "Mute"}
    </button>
  );
};

const PipButton = () => {
  const dispatch = useMediaDispatch();
  const mediaIsPip = useMediaSelector(
    (state) => state.mediaIsPip
  );
  return (
    <button
      style={{ cursor: "pointer" }}
      onClick={() => {
        const type = mediaIsPip
          ? MediaActionTypes.MEDIA_EXIT_PIP_REQUEST
          : MediaActionTypes.MEDIA_ENTER_PIP_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsPip ? "Enter Pip" : "Exit Pip"}
    </button>
  );
};

const FullscreenButton = () => {
  const dispatch = useMediaDispatch();
  const mediaIsFullscreen = useMediaSelector(
    (state) => state.mediaIsFullscreen
  );
  return (
    <button
      style={{ cursor: "pointer" }}
      onClick={() => {
        const type = mediaIsFullscreen
          ? MediaActionTypes.MEDIA_EXIT_FULLSCREEN_REQUEST
          : MediaActionTypes.MEDIA_ENTER_FULLSCREEN_REQUEST;
        dispatch({ type });
      }}
    >
      {!mediaIsFullscreen
        ? "Enter Fullscreen"
        : "Exit Fullscreen"}
    </button>
  );
};

const TimeRange = () => {
  const dispatch = useMediaDispatch();
  const mediaCurrentTime = useMediaSelector(
    (state) => state.mediaCurrentTime
  );
  const mediaDuration = useMediaSelector(
    (state) => state.mediaDuration
  );
  return (
    <input
      style={{ flexGrow: 1 }}
      type="range"
      min={0}
      max={Number.isNaN(mediaDuration) ? 0 : mediaDuration}
      value={mediaCurrentTime ?? 0}
      step={0.1}
      onChange={(event) => {
        const type = MediaActionTypes.MEDIA_SEEK_REQUEST;
        const detail = +event.target.value;
        dispatch({ type, detail });
      }}
    />
  );
};

const VolumeRange = () => {
  const dispatch = useMediaDispatch();
  const mediaVolume = useMediaSelector(
    (state) => state.mediaVolume
  );
  return (
    <input
      type="range"
      min={0}
      max={1}
      value={mediaVolume ?? 0.5}
      step={0.1}
      onChange={(event) => {
        const type = MediaActionTypes.MEDIA_VOLUME_REQUEST;
        const detail = +event.target.value;
        dispatch({ type, detail });
      }}
    />
  );
};

const Video = ({ src }) => {
  const mediaRefCallback = useMediaRef();
  return (
    <mux-video
      ref={mediaRefCallback}
      slot="media"
      playbackId="ndBAM4NjPXRbTE01xtE4ywe7129zNYuEEiT2H59GJpzQ"
      src={src}
      preload="auto"
      muted
      crossOrigin=""
      playsInline
    >
      <track
        label="thumbnails"
        default
        kind="metadata"
        src="https://image.mux.com/DS00Spx1CV902MCtPj5WknGlR102V5HFkDe/storyboard.vtt"
      />
    </mux-video>
  );
};

const Container = ({ children }) => {
  const fullscreenRefCallback = useMediaFullscreenRef();
  return (
    <div
      id="fullscreen"
      style={{
        display: "flex",
        flexDirection: "column"
      }}
      ref={fullscreenRefCallback}
    >
      {children}
    </div>
  );
};

const Player = ({ src }) => {
  return (
    <MediaProvider>
      <Container>
        <Video src={src} />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "rgba(0, 0, 0, 0.7)"
          }}
        >
          <div
            style={{
              display: "flex",
              width: "100%",
              padding: "5px 0"
            }}
          >
            <TimeRange />
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              padding: "5px 10px",
              alignItems: "center"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <PlayButton />
              <MuteButton />
              <VolumeRange />
            </div>

            <div style={{ flexGrow: 1 }}></div>

            <div
              style={{
                display: "flex",
                alignItems: "center"
              }}
            >
              <PlaybackRateButton />
              <PipButton />
              <FullscreenButton />
            </div>
          </div>
        </div>
      </Container>
    </MediaProvider>
  );
};

export default Player;
