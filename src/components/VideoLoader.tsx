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
    
    // Safety timeout: transition to main page after 3 seconds maximum
    timeoutRef.current = setTimeout(() => {
      safeComplete();
    }, 3000);

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
      <style>{`@media (max-width: 767px) { #loader-video { object-fit: contain; } }`}</style>
      {/* Subtle film grain overlay */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-[0.035]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px 256px" }} />
      <video
        id="loader-video"
        ref={videoRef}
        muted
        playsInline
        // @ts-ignore — webkit vendor attribute for iOS inline playback
        webkit-playsinline="true"
        disablePictureInPicture
        disableRemotePlayback
        preload="metadata"
        onEnded={safeComplete}
        // On mobile, if video errors or stalls, auto-skip to main page
        onError={safeComplete}
        onStalled={safeComplete}
        className={`absolute inset-0 w-full h-full object-cover ${phase === "boot" ? "opacity-0" : "opacity-100"} transition-opacity duration-700`}
        style={{ willChange: "transform", backgroundColor: "#0e0e0e" }}
      >
        <source src="/final.webm" type="video/webm" />
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
