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
    videoRef.current?.play().catch(() => {});
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
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        onEnded={onComplete}
        className={`w-full h-full object-cover ${phase === "boot" ? "hidden" : ""}`}
        style={{ willChange: "transform" }}
      />
    </div>
  );
};
