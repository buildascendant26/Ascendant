import React, { useEffect, useRef, useState } from "react";

type BootSequenceProps = {
  onComplete: () => void;
};

type Phase =
  | "cursor"
  | "typing"
  | "booting"
  | "ready"
  | "fading"
  | "title"
  | "prompt";

const COMMAND = "ascendant@boot:~$ systemctl start ascendant.target";

const BOOT_LOG = [
  "[ OK ] Loading kernel modules",
  "[ OK ] Mounting /ascendant",
  "[ OK ] Starting innovation.service",
  "[ OK ] Initializing wayland compositor",
  "[ OK ] Loading hackathon assets",
  "[ OK ] Preparing workspaces",
  "[ OK ] Starting ascendant.target",
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>("cursor");
  const [typedChars, setTypedChars] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showReady, setShowReady] = useState(false);
  const [logOpacity, setLogOpacity] = useState(1);
  const [logTranslateY, setLogTranslateY] = useState(0);
  const [titleOpacity, setTitleOpacity] = useState(0);
  const [titleScale, setTitleScale] = useState(0.92);
  const [promptOpacity, setPromptOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        ('ontouchstart' in window) || 
        navigator.maxTouchPoints > 0 || 
        window.innerWidth < 768
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 0;

    t += 400;
    timers.push(setTimeout(() => setPhase("typing"), t));

    for (let i = 1; i <= COMMAND.length; i++) {
      t += rand(20, 50);
      timers.push(setTimeout(() => setTypedChars(i), t));
    }

    t += 400;
    timers.push(setTimeout(() => setPhase("booting"), t));

    for (let i = 0; i < BOOT_LOG.length; i++) {
      t += rand(400, 800);
      timers.push(setTimeout(() => setVisibleLines(i + 1), t));
    }

    t += 400;
    timers.push(setTimeout(() => {
      setShowReady(true);
      setPhase("ready");
    }, t));

    t += 1800;
    timers.push(setTimeout(() => {
      setPhase("fading");
      setLogOpacity(0);
      setLogTranslateY(-12);
    }, t));

    t += 500;
    timers.push(setTimeout(() => {
      setPhase("title");
      setTitleOpacity(1);
      setTitleScale(1);
    }, t));

    t += 1000;
    timers.push(setTimeout(() => {
      setPhase("prompt");
      setPromptOpacity(1);
      containerRef.current?.focus();
    }, t));

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Click anywhere to continue when prompt phase is active
  const handleClick = () => {
    if (phase === "prompt") {
      onComplete();
    }
  };

  const showCursor = phase === "cursor" || phase === "typing";
  const typedCommand = COMMAND.slice(0, typedChars);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="fixed inset-0 bg-black flex items-center justify-center outline-none cursor-pointer"
      style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', 'Courier New', monospace", touchAction: "manipulation" }}
      aria-label="Ascendant boot sequence"
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: logOpacity,
          transform: `translateY(${logTranslateY}px)`,
          transition: "opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1), transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
          pointerEvents: logOpacity === 0 ? "none" : "auto",
          willChange: "opacity, transform",
        }}
      >
        <div style={{ width: "100%", maxWidth: 560, padding: "0 1.25rem" }}>
          {(phase === "cursor" || phase === "typing" || phase === "booting" || phase === "ready") && (
            <div style={{ fontSize: 12, color: "#ffffff", marginBottom: 20, display: "flex", alignItems: "center", wordBreak: "break-all" }}>
              <span>{typedCommand}</span>
              {showCursor && (
                <span className="boot-cursor" style={{ color: "#ffffff", marginLeft: 2, animation: "blinkCursor 0.8s step-end infinite" }}>█</span>
              )}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {BOOT_LOG.slice(0, visibleLines).map((line, i) => {
              const isOk = line.startsWith("[ OK ]");
              const rest = isOk ? line.slice(6) : line;
              return (
                <div
                  key={i}
                  style={{
                    fontSize: 13,
                    color: "#ffffff",
                    animation: "fadeInLine 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    transformOrigin: "left center",
                  }}
                >
                  {isOk && (
                    <span style={{ color: "#888888" }}>
                      {"[ "}
                      <span style={{ color: "#4ade80", fontWeight: "bold" }}>OK</span>
                      {" ]"}
                    </span>
                  )}
                  <span style={{ color: "#aaaaaa" }}>{rest}</span>
                </div>
              );
            })}
          </div>

          {showReady && (
            <div
              style={{
                marginTop: 20,
                fontSize: 13,
                color: "#ffffff",
                animation: "slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
              }}
            >
              System ready.
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: titleOpacity === 0 ? "none" : "auto",
          willChange: "opacity, transform",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.3em",
            color: "#ffffff",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          ASCENDANT 2026
        </div>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.2em",
            color: "#555555",
            textTransform: "uppercase",
            marginBottom: 48,
          }}
        >
          The Future Boots Here.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            opacity: promptOpacity,
            transition: "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#666666",
              textTransform: "uppercase",
              animation: promptOpacity === 1 ? "pulsePrompt 2.5s ease-in-out infinite" : "none",
            }}
          >
            {isMobile ? "TAP TO CONTINUE" : "CLICK ANYWHERE to continue"}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulsePrompt {
          0%, 100% { opacity: 0.25; }
          50%       { opacity: 1; }
        }
        @keyframes blinkCursor {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .boot-button:hover, .boot-button:focus {
          background-color: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(255, 255, 255, 0.9) !important;
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.25) !important;
          transform: translateY(-1px);
        }
        .boot-button:active {
          transform: translateY(1px);
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
    </div>
  );
}
