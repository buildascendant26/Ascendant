import { useEffect, useRef, useState } from "react";
import BootSequence from "./BootSequence";

interface VideoLoaderProps {
  onComplete: () => void;
}

export const VideoLoader: React.FC<VideoLoaderProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"boot" | "video">("boot");

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  }, []);

  const handleBootComplete = () => {
    setPhase("video");
    const video = videoRef.current;
    if (!video) {
      onComplete();
      return;
    }
    // Attempt to play; if blocked (mobile autoplay policy), skip video entirely
    video.play().catch(() => {
      onComplete();
    });
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-[100]">
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
        onEnded={onComplete}
        // On mobile, if video errors or stalls, auto-skip to main page
        onError={onComplete}
        onStalled={() => {
          // Give it 3 seconds to recover, then skip
          setTimeout(() => {
            const video = videoRef.current;
            if (video && video.paused) {
              onComplete();
            }
          }, 3000);
        }}
        className={`w-full h-full object-cover ${phase === "boot" ? "hidden" : ""}`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
};
