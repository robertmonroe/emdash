import { useState, useRef, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  src: string;
  narrator?: string;
  runtime?: string;
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, narrator, runtime }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const bar = progressRef.current;
      if (!audio || !bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
    },
    [duration],
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },
    playerRow: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    playButton: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: "#d97706",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      padding: 0,
    },
    progressTrack: {
      flex: 1,
      height: "6px",
      backgroundColor: "#e5e7eb",
      borderRadius: "3px",
      cursor: "pointer",
      position: "relative" as const,
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#d97706",
      borderRadius: "3px",
      width: `${progress}%`,
      transition: "width 0.1s linear",
    },
    time: {
      fontSize: "13px",
      color: "#78716c",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap" as const,
      flexShrink: 0,
    },
    meta: {
      display: "flex",
      gap: "16px",
      flexWrap: "wrap" as const,
      fontSize: "14px",
      color: "#78716c",
    },
  };

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={src} preload="metadata" />

      <div style={styles.playerRow}>
        <button
          style={styles.playButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause" : "Play"}
          type="button"
        >
          {isPlaying ? (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
              <rect x="1" y="0" width="4" height="16" rx="1" />
              <rect x="9" y="0" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="16" viewBox="0 0 14 16" fill="white">
              <polygon points="2,0 14,8 2,16" />
            </svg>
          )}
        </button>

        <div ref={progressRef} style={styles.progressTrack} onClick={handleProgressClick}>
          <div style={styles.progressFill} />
        </div>

        <span style={styles.time}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {(narrator || runtime) && (
        <div style={styles.meta}>
          {narrator && <span>Narrated by {narrator}</span>}
          {runtime && <span>Full audiobook: {runtime}</span>}
        </div>
      )}
    </div>
  );
}
