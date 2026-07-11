import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AsciiField } from "./AsciiField";

const ACCENT = "#cba6f7";

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const [viewportH, setViewportH] = useState(window.innerHeight);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 85);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      setBootProgress(Math.min(frame / totalFrames, 1));
      if (frame >= totalFrames) {
        clearInterval(interval);
        setTimeout(() => {
          setBootDone(true);
          focusInput();
        }, 300);
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const focusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 5);
  }, []);

  useEffect(() => {
    focusInput();
  }, [bootDone, focusInput]);

  // Only scroll on submit state changes
  useEffect(() => {
    if (submitted || isSubmitting) {
      const t = setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
      return () => clearTimeout(t);
    }
  }, [submitted, isSubmitting]);

  // Track visual viewport height so the terminal shrinks when the mobile
  // keyboard opens instead of getting cut off.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setViewportH(vv.height);
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        navigate("/", { state: { skipLoading: true } });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const val = input.trim();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setErrorMsg("Please enter a valid email address");
      setShakeKey((k) => k + 1);
      setTimeout(() => setErrorMsg(""), 3000);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    await Promise.race([
      fetch("https://script.google.com/macros/s/AKfycbwPwspZCHvSIR-zajMoCpIyORL-r0GCAbWAGPQVGmILIftG-p321aqxso0Bstf3sSE-/exec", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ action: "sendBrochure", email: val }),
      }).catch((e) => console.error("GAS fetch failed:", e)),
      new Promise((r) => setTimeout(r, 20000)),
    ]);

    setSendProgress(1);
    await new Promise((r) => setTimeout(r, 200));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (isSubmitting) return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div
      className="fixed inset-0 w-screen z-50 bg-black flex items-center justify-center select-none overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.35s ease",
        height: viewportH,
      }}
    >
      <AsciiField progress={bootDone ? (submitted ? 1 : 0.8) : bootProgress / 3} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          key={shakeKey}
          className="flex flex-col relative z-10 w-full"
          style={{
            maxWidth: 600,
            height: "auto",
            minHeight: 300,
            maxHeight: viewportH - 48,
            border: "1px solid #2a2a2a",
            borderRadius: 8,
            overflow: "hidden",
            backgroundColor: "#000000",
            boxShadow: "0 20px 50px rgba(0,0,0,0.9)",
            animation: errorMsg ? "shake 0.4s ease" : "none",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center shrink-0 select-none"
            style={{
              height: 42,
              padding: "0 18px",
              borderBottom: "1px solid #1a1a1a",
              backgroundColor: "#0a0a0a",
            }}
          >
            <div className="flex items-center gap-2 mr-4">
              <button
                onClick={() => navigate("/", { state: { skipLoading: true } })}
                className="w-3.5 h-3.5 rounded-full bg-red-500/80 border border-red-600/80 hover:bg-red-500 transition-colors cursor-pointer"
                title="Cancel"
              />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#2a2a2a", border: "1px solid #333" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#2a2a2a", border: "1px solid #333" }} />
            </div>
            <div
              className="flex-1 text-center text-xs tracking-wider truncate"
              style={{ color: "#666", fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
            >
              [term] brochure — ascendant 2026
            </div>
            <button
              onClick={() => navigate("/", { state: { skipLoading: true } })}
              className="px-2.5 py-0.5 border border-white/10 hover:border-white/30 text-[9px] font-mono rounded text-neutral-450 hover:text-white transition-all cursor-pointer bg-neutral-900/40"
            >
              CLOSE
            </button>
          </div>

          {/* Terminal body */}
          <div
            className="flex-1 overflow-y-auto p-6 md:p-10"
            style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace" }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Initial command */}
            <div className="mb-5 text-sm md:text-base" style={{ lineHeight: 1.7 }}>
              <span style={{ color: ACCENT }}>ascendant@core</span>
              <span style={{ color: "#666" }}>:~$ </span>
              <span style={{ color: "#eee" }}>./brochure --request</span>
            </div>

            {/* Boot / loading */}
            {!bootDone && (
              <div className="mb-6 text-sm md:text-base" style={{ lineHeight: 1.7 }}>
                <div className="mb-2" style={{ color: "#aaa" }}>
                  Initializing...
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    height: 18,
                    border: "1px solid #2a2a2a",
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "transparent",
                  }}
                >
                  <div
                    style={{
                      width: `${(bootProgress / 3) * 100}%`,
                      height: "100%",
                      backgroundColor: ACCENT,
                      transition: "width 0.05s linear",
                      opacity: 0.7,
                    }}
                  />
                </div>
                <div className="mt-1" style={{ color: "#555", fontSize: 12 }}>
                  {Math.round((bootProgress / 3) * 100)}%
                </div>
              </div>
            )}

            {/* Prompt */}
            {bootDone && !submitted && (
              <>
                <div className="mb-1 flex flex-wrap items-center gap-1 text-sm md:text-base" style={{ lineHeight: 1.7 }}>
                  <span style={{ color: "#555" }}>&gt; </span>
                  <span style={{ color: "#ffffff", fontWeight: 600 }}>Enter email to receive the brochure:</span>
                </div>
                <div className="mb-3 text-sm md:text-base" style={{ lineHeight: 1.7 }}>
                  <span style={{ color: "#555" }}>&gt; </span>
                  <span style={{ color: "#eee" }}>{input}</span>
                  <CursorBlink show={!isSubmitting} />
                </div>
                <div className="mb-3 text-[11px] md:text-[12px]" style={{ lineHeight: 1.7, color: "#666" }}>
                  (registration link will be in the brochure)
                </div>
              </>
            )}

            {isSubmitting && (
              <div className="mb-3 text-sm md:text-base" style={{ lineHeight: 1.7 }}>
                <div className="mb-2" style={{ color: ACCENT }}>
                  Sending brochure...
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 400,
                    height: 16,
                    border: "1px solid #2a2a2a",
                    borderRadius: 2,
                    overflow: "hidden",
                    backgroundColor: "transparent",
                    position: "relative",
                  }}
                >
                  <div
                    className={sendProgress === 0 ? "indeterminate" : ""}
                    style={{
                      width: sendProgress === 0 ? "35%" : `${sendProgress * 100}%`,
                      height: "100%",
                      backgroundColor: ACCENT,
                      transition: sendProgress > 0 ? "width 0.2s ease" : "none",
                      opacity: 0.7,
                      ...(sendProgress === 0 ? { position: "absolute", inset: 0 } : {}),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Error message */}
            {errorMsg && (
              <div className="mb-3 text-sm md:text-base" style={{ lineHeight: 1.7, color: "#ff4444" }}>
                ! {errorMsg}
              </div>
            )}

            {/* Hidden input */}
            <input
              ref={inputRef}
              type="email"
              inputMode="email"
              enterKeyHint="send"
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\n/g, ""))}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
              className="absolute opacity-0 pointer-events-none"
              style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, border: 0, padding: 0, fontSize: 16, background: "transparent" }}
              aria-hidden="true"
              tabIndex={-1}
              autoFocus
            />

            {/* Submitted confirmation */}
            {submitted && (
              <div className="mt-2 text-sm md:text-base" style={{ lineHeight: 1.7 }}>
                <div className="mb-3" style={{ color: ACCENT, fontWeight: 600 }}>
                  ✓ Brochure sent to <span style={{ color: "#fff" }}>{input}</span>
                </div>
                <div style={{ color: "#888" }}>
                  Check your inbox (and spam folder) for the Ascendant 2026 brochure.
                </div>
                <div className="mt-1 text-[11px] md:text-[12px]" style={{ lineHeight: 1.5, color: "#666" }}>
                  The brochure will arrive in your inbox momentarily.
                </div>
                <div className="mt-6" style={{ color: "#666" }}>
                  Press <span style={{ color: "#888" }}>Ctrl+D</span> or click below to return
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

            {/* Clickable bottom return bar */}
          <button
            onClick={() => navigate("/", { state: { skipLoading: true } })}
            className="shrink-0 text-center text-[10px] tracking-widest select-none py-3 border-t border-neutral-900 bg-neutral-950/80 hover:bg-neutral-900 hover:text-white transition-all text-neutral-60 cursor-pointer"
          >
            CTRL+D — RETURN TO LANDING PAGE
          </button>
        </div>
      </div>

      <style>{`
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .indeterminate {
          animation: indeterminateSlide 1.4s ease-in-out infinite;
        }
        @keyframes indeterminateSlide {
          0% { left: -35%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};

function CursorBlink({ show }: { show: boolean }) {
  return (
    <span
      className="inline-block w-1.5 h-3.5 bg-neutral-200 ml-1.5 align-text-bottom animate-[cursorBlink_1s_step-end_infinite]"
      style={{ animationPlayState: show ? "running" : "paused" }}
    />
  );
}
