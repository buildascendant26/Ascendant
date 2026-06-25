import { useEffect, useRef, useState } from "react";
import BootSequence from "./BootSequence";

interface VideoLoaderProps {
  onComplete: () => void;
}

export const VideoLoader: React.FC<VideoLoaderProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"boot" | "video">("boot");
  const hasCompleted = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const safeComplete = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onComplete();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleBootComplete = () => {
    setPhase("video");
    const video = videoRef.current;
    
    // Safety timeout: transition to main page after 5 seconds maximum
    timeoutRef.current = setTimeout(() => {
      safeComplete();
    }, 5000);

    if (!video) {
      safeComplete();
      return;
    }
    
    // Attempt to play; if blocked, skip video entirely
    video.play()
      .catch(() => {
        safeComplete();
      });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen h-[100dvh] bg-black z-[100]">
      {phase === "boot" && (
        <BootSequence onComplete={handleBootComplete} />
      )}
      <video
        ref={videoRef}
        src="/final.mp4"
        muted
        playsInline
        // @ts-ignore — webkit vendor attribute for iOS inline playback
        webkit-playsinline="true"
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        onEnded={safeComplete}
        // On mobile, if video errors or stalls, auto-skip to main page
        onError={safeComplete}
        onStalled={safeComplete}
        className={`w-full h-full object-cover ${phase === "boot" ? "hidden" : ""}`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
};
