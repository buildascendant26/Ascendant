import React, { useEffect, useRef, useState } from 'react';

interface VideoLoaderProps {
  onComplete: () => void;
}

export const VideoLoader: React.FC<VideoLoaderProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Fallback timer of 5.5 seconds just in case the browser blocks the video entirely or there's an error
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete]);

  // Attempt to play on mount
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
        .then(() => setHasStarted(true))
        .catch(() => {
          // If browser blocked it, we'll wait or fallback
        });
    }
  };

  useEffect(() => {
    handlePlay();
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center z-[100] select-none overflow-hidden">
      <video
        ref={videoRef}
        src="/final.mp4"
        autoPlay
        muted={!soundEnabled}
        playsInline
        preload="auto"
        onPlay={() => setHasStarted(true)}
        onEnded={onComplete}
        className="w-full h-full object-cover transition-opacity duration-1000 scale-100"
      />



      {/* Clean elegant top loader bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-neutral-900 overflow-hidden">
        <div className="h-full bg-white animate-[marquee_5s_linear_infinite] w-1/3" />
      </div>
    </div>
  );
};
