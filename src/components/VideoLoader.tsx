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
      <video
        ref={videoRef}
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
        className={`absolute inset-0 w-full h-full object-cover ${phase === "boot" ? "opacity-0" : "opacity-100"} transition-opacity duration-700`}
      >
        <source src="/final.webm" type="video/webm" />
        <source src="/final.mp4" type="video/mp4" />
      </video>
      {phase === "boot" && (
        <div className="absolute inset-0 z-10">
          <BootSequence onComplete={handleBootComplete} />
        </div>
      )}
      <button
        onClick={safeComplete}
        className="fixed bottom-6 right-6 z-20 text-[11px] font-mono tracking-[0.15em] text-neutral-600 hover:text-neutral-300 transition-colors duration-300 uppercase cursor-pointer"
      >
        Skip loading →
      </button>
    </div>
  );
};
