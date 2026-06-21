import { useEffect, useRef, useState } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~";

interface ScrambleTextProps {
  text: string;
  trigger: number | string;
  as?: "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4";
  className?: string;
}

export default function ScrambleText({ text, trigger, as: Tag = "span", className }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let frame = 0;
    const totalFrames = 20;
    const targetChars = text.split("");

    const interval = setInterval(() => {
      frame++;

      const resolved = targetChars.map((char, i) => {
        if (char === " ") return " ";
        const resolveAt = Math.floor(
          (i / Math.max(targetChars.length, 1)) * totalFrames * 0.6 +
            Math.random() * totalFrames * 0.4
        );
        if (frame >= resolveAt) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      });

      setDisplayText(resolved.join(""));

      if (frame >= totalFrames) {
        setDisplayText(text);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [trigger]);

  return <Tag className={className}>{displayText}</Tag>;
}
