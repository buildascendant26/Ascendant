import React, { useEffect, useRef, useState } from 'react';

interface VideoLoaderProps {
  onComplete: () => void;
}

export const VideoLoader: React.FC<VideoLoaderProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration > 0) {
        setProgress(video.currentTime / video.duration);
      }
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    return () => video.removeEventListener('timeupdate', onTimeUpdate);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex items-center justify-center z-[100] select-none overflow-hidden" style={{ contain: 'strict' }}>
      <video
        ref={videoRef}
        src="/final.mp4"
        autoPlay
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        preload="auto"
        onPlay={() => setHasStarted(true)}
        onEnded={onComplete}
        className="w-full h-full object-cover"
        style={{ willChange: 'transform' }}
      />

      {!hasStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin" />
          <span className="font-mono text-[10px] text-neutral-500 tracking-[0.3em] uppercase">
            Loading
          </span>
        </div>
      )}

      {hasStarted && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48">
          <div className="w-full h-[1px] bg-neutral-800">
            <div
              className="h-full bg-white/60 transition-all duration-150 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
